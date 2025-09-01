'use client'

import { usePathname, useRouter } from 'next/navigation';
import { CSSProperties, Dispatch, Fragment, isValidElement, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react'
import Confirm from './popups/Confirm';
import Search from './Search';
import { api, cn, useFormManager } from '../utils/frontend';
import {
  CaretLeftIcon, CaretRightIcon, DotsThreeIcon, DotsThreeOutlineVerticalIcon, FadersIcon, NotePencilIcon, PlusCircleIcon, TrashIcon, XIcon
} from '@phosphor-icons/react';
import { toast } from 'react-toastify';
import { useContextGlobal } from '../contexts/ContextGlobal';
import Link from 'next/link';
import Dropdown from './popups/Dropdown';
import InputText from './inputs/InputText';
import Input, { typeInputType } from './inputs/Input';


export interface typeDataTable {
  data?: (Record<string, any> | ReactNode)[];
  paginate?: {
    page?: number;
    per_page: number;
    total?: number;
  };
  primaryKey?: string;
  statusCode?: number;
}

interface typeTableProps {
  className?: string;

  type?: 'carded-section' | 'carded' | 'striped';
  prototypeTable: Array<{
    title: string;
    keyData: string | ((dataRow: Record<string, any>, indexDataRow?: any) => ReactNode);
    className?: string;
    style?: CSSProperties;
    advanceSearch?: { name?: string; };
    advanceFilter?: {
      name?: string;
      type?: typeInputType;
      selectConfig?: {
        options?: Array<string | number | { label: ReactNode; value: any }>;
        optionFromApi?: {
          primaryKey?: string;
          host?: string;
          path: string;
          render: (data: Record<string, any>[]) => ({ label: ReactNode; value: string | number }[]);
        };
        onSearch?: (value: string) => any;
        noSearch?: boolean;
        noUnset?: boolean;
      };
    };
  }>;
  actions?: ((dataRow: Record<string, any>, indexDataRow?: any) => ('show' | 'edit' | 'delete' | ReactNode)[]);
  host?: string;
  path?: string;
  fmParams?: ReturnType<typeof useFormManager>;
  primaryKey?: string;
  stateDataTable?: [typeDataTable, Dispatch<SetStateAction<typeDataTable>>];
  stateSelectedRows?: [Record<string, any>[], Dispatch<SetStateAction<(Record<string, any> | ReactNode)[]>>];

  onShow?: (idItem: any, primaryKey?: any) => any;
  onEdit?: (idItem: any, primaryKey?: any) => any;
  onDelete?: (idItem: any, callbackHandler: (noReload?: boolean) => any) => any;
  onSearch?: (value: string) => any;

  showAdvanceSearch?: boolean;
  noAdvanceFilter?: boolean;
  noHeader?: boolean;
  noNumber?: boolean;
  noSearch?: boolean;
  noPerPage?: boolean;
  noPaginate?: boolean;

  leftElement?: ReactNode;
  rightElement?: ReactNode;
}
export default function Table({
  className,

  type,
  prototypeTable,
  actions,
  host,
  path,
  fmParams,
  primaryKey = "id",
  stateDataTable,
  stateSelectedRows,


  onShow,
  onEdit,
  onDelete,
  onSearch,

  showAdvanceSearch,
  noAdvanceFilter,
  noHeader,
  noNumber,
  noSearch,
  noPerPage,
  noPaginate,

  leftElement,
  rightElement,
}: typeTableProps) {
  const router = useRouter();
  const pathName = usePathname();
  const { ScreenWidth } = useContextGlobal();
  const refTOAdvanceSearch = useRef<NodeJS.Timeout[]>([]);
  const [ShowConfirmDelete, setShowConfirmDelete] = useState(null);
  const [ShowAction, setShowAction] = useState<number | undefined>(undefined);
  const [DataTables, setDataTables] = stateDataTable ?? useState<typeDataTable>({});
  const [SelectedRows, setSelectedRows] = stateSelectedRows ?? [];
  const fmFilters = useFormManager();
  if (!fmParams) fmParams = useFormManager();



  /**
   * Function Handler
   */
  function loadData() {
    if (path) {
      setDataTables((prev) => ({ ...prev, statusCode: 202 }));
      api({ path, host, objParams: fmParams?.values }).then(async (res) => {
        let { data, meta: paginate, message } = await res.json();
        if (res.status != 200) toast.error(message);
        if (!paginate) paginate = { page: 1, per_page: 10, total: 0, total_pages: 1 };
        if (!data) data = [];
        setDataTables((prev) => ({ ...prev, data: data, paginate, statusCode: res.status }));
      });
    }
  }

  function handleDelete() {
    const idDeleted = ShowConfirmDelete
    if (onDelete) {
      onDelete(idDeleted, (noReload) => {
        setShowConfirmDelete(null);
        if (!noReload) loadData();
      });
    } else if (path) {
      api({ host, method: 'DELETE', path: `${path}/${idDeleted}`, }).then(async (res) => {
        if (res.status == 200) {
          setShowConfirmDelete(null);
          loadData();
          const { message } = await res.json();
          toast.success(message)
        }
      });
    } else {
      setShowConfirmDelete(null);
    }
  };

  function handleSearch(keyWord: string) {
    if (onSearch) onSearch(keyWord);
    fmParams?.setValues((prev) => ({ ...prev, page: 1, search: keyWord }));
  }

  function onChangePage(newPage: number) {
    if ((fmParams?.values?.page ?? DataTables?.paginate?.page ?? 1) != newPage)
      fmParams?.setValues((prev: typeDataTable) => ({ ...prev, page: newPage }));
  }

  const getDataCell = (dataRow: Record<string, any>, keyData: any) => (typeof (keyData) == 'function' ? keyData(dataRow) : dataRow[keyData]);



  /**
   * useEffect
   */
  useEffect(loadData, [path, host, fmParams?.values]);



  /**
   * Short hand var
   */
  const dataShoweds = path ? DataTables.data : DataTables.data?.filter((data: any) => (
    prototypeTable?.find(({ keyData }) => (
      String(isValidElement(data) ? data : getDataCell(data, keyData))
        .toLowerCase().match(String(fmParams?.values?.search ?? '')?.toLowerCase())
    ))
  ));
  const totalItem = DataTables?.paginate?.total ?? dataShoweds?.length ?? 0;
  const perPage = fmParams?.values?.per_page ?? DataTables?.paginate?.per_page ?? 10;
  const currentPage = fmParams?.values?.page ?? DataTables?.paginate?.page ?? 1;
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;
  const lastPage = Math.ceil(totalItem / perPage) || 1;
  const dataPaginateds = (path || !DataTables.paginate) ? dataShoweds : dataShoweds?.filter((_, indexDataRow) => (
    (indexDataRow >= (perPage * (currentPage - 1))) && (indexDataRow < (perPage * currentPage))
  ));
  const sequenceFirstItemShowed = perPage * (currentPage > 0 ? currentPage - 1 : 0);
  if (noNumber == undefined) noNumber = ScreenWidth <= 640;
  let cnItem = `inline-flex items-center justify-center rounded-md ring-offset-background transition-colors`;
  cnItem += ` hover:bg-gray-100 h-8 cursor-pointer aspect-square`;
  let rowNumber = 0;



  /**
   * Rendered JSX
   */
  return (
    <>
      <div className='bg-white'>
        <div className="flex max-xl:flex-col gap-4 pb-4">
          <div className=''>{leftElement}</div>
          <div className='lg:ml-auto'>
            <div className=' flex max-lg:flex-col gap-2'>
              <Fragment>{rightElement}</Fragment>
              {(!noSearch || !noAdvanceFilter) && (
                <div className='grow flex relative'>
                  {!noSearch && (<Search className={`${!noAdvanceFilter ? 'rounded-r-none' : ''} h-10`} onSubmit={handleSearch} />)}
                  {!noAdvanceFilter && (<>
                    <div
                      className={`btn-flat btn-sm bg-primary text-contras-primary px-4 h-10 ${!noSearch ? 'rounded-l-none' : ''}`}
                      onClick={() => fmFilters.setIsShow(true)}
                    ><FadersIcon weight='fill' className='text-base rotate-90' /><span>Filter</span></div>
                    <Dropdown
                      show={fmFilters.isShow}
                      toHide={() => {
                        fmFilters.setValue('filters', fmParams.values.filters ?? [])
                        fmFilters.setIsShow(false)
                      }}
                      className='top-12 right-0 sm:min-w-md max-w-xl p-4 z-[5]'
                    >
                      <div>
                        <div className='text-sm font-semibold'>Filter Table</div>
                        <table className='text-sm w-full [&>tbody>tr>td]:pt-4'>
                          <tbody>
                            {(fmFilters.values.filters as any[])?.map((filter, indexFilter) => (
                              <tr key={indexFilter}>
                                <td>
                                  <select
                                    value={filter?.[0]}
                                    onChange={(event) => {
                                      fmFilters.setValue('filters', (prev: any) => {
                                        prev[indexFilter] = [event.target.value, prev?.[indexFilter]?.[1], prev?.[indexFilter]?.[2]];
                                        return [...prev];
                                      });
                                    }}
                                    className='appearance-none invalid:text-gray-500 w-full h-[2.25rem] border-gray-300 border px-2 rounded-l-md sm:min-w-16'
                                    required
                                  >
                                    <option value="">-- Kolom -- -</option>
                                    {prototypeTable.map((pt, indexPt) => (pt.advanceFilter?.name != '' && (
                                      <option key={indexPt} value={pt.title ?? ""}>{pt.title}</option>
                                    )))}
                                  </select>
                                </td>
                                <td>
                                  <select
                                    value={filter?.[1]}
                                    onChange={(event) => {
                                      fmFilters.setValue('filters', (prev: any) => {
                                        prev[indexFilter] = [prev?.[indexFilter]?.[0], event.target.value, prev?.[indexFilter]?.[2]];
                                        return [...prev];
                                      });
                                    }}
                                    className='appearance-none invalid:text-gray-500 w-full h-[2.25rem] border-gray-300 border-y px-2 sm:min-w-8 text-center'
                                    required
                                  >
                                    <option value="">-- Operator -- -</option>
                                    {['=', '<', '>', '%'].map((sym, indexSym) => (<option key={indexSym}>{sym}</option>))}
                                  </select>
                                </td>
                                <td>
                                  <div className='[&_.input-form]:rounded-none [&_.input-form]:border-r-0'>
                                    <Input
                                      noLabel
                                      value={filter?.[2]}
                                      onChange={(event) => {
                                        fmFilters.setValue('filters', (prev: any) => {
                                          prev[indexFilter] = [prev?.[indexFilter]?.[0], prev?.[indexFilter]?.[1], event.target.value]
                                          return [...prev]
                                        })
                                      }}
                                      placeholder='-- Isi Filter --'
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div
                                    className='h-[2.25rem] px-2 flex border rounded-r-md text-gray-600 cursor-pointer hover:text-red-500'
                                    onClick={() => {
                                      fmFilters.setValue('filters', (prev: any[]) => prev.filter((_, indexRmFilter) => indexRmFilter != indexFilter))
                                    }}><TrashIcon className='text-base m-auto' weight='bold' /></div>
                                </td>
                              </tr>
                            ))}
                            <tr>
                              <td colSpan={4}>
                                <div
                                  className='inline-flex items-center gap-1 bg-primary/10 text-primary rounded px-2 py-1.5 cursor-pointer'
                                  onClick={() => fmFilters.setValue('filters', (prev: any) => ([...(prev ?? []), []]))}
                                >
                                  <PlusCircleIcon weight='bold' />
                                  <span className='text-xs font-medium'>Filter Baru</span>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={4}>
                                <div className='w-full flex justify-end items-center gap-2'>
                                  <div
                                    className='btn-flat btn-sm bg-gray-100'
                                    onClick={() => {
                                      fmFilters.setValue('filters', fmParams.values.filters ?? [])
                                      fmFilters.setIsShow(false)
                                    }}>batal</div>
                                  <div
                                    className='btn btn-sm'
                                    onClick={() => {
                                      fmParams.setValue('filters', fmFilters.values.filters ?? [])
                                      fmFilters.setIsShow(false)
                                    }}>terapkan</div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </Dropdown>
                  </>)}
                </div>
              )}
            </div>
            <div className='flex sm:justify-end gap-2 mt-2'>
              {(fmParams.values?.filters as any[])?.map((filter, indexFilter) => {
                if (!(filter[0] && filter[1])) return null;
                return (
                  <div
                    key={indexFilter}
                    className={cn(
                      'border rounded-full flex items-center gap-2 text-sm cursor-pointer hover:bg-primary/10 hover:text-primary',
                      '[&:has(.btn-delete:hover)]:text-red-500 [&:has(.btn-delete:hover)]:border-transparent [&:has(.btn-delete:hover)]:bg-red-50'
                    )}
                  >
                    <div
                      className='pl-4 py-1.5 rounded-l-full'
                      onClick={() => {
                        fmFilters.setValue('filters', fmParams.values?.filters ?? []);
                        fmFilters.setIsShow(true);
                      }}
                    >{filter.join(' ')}</div>
                    <XIcon
                      className='mt-[1px] hover:text-red-500 h-full mr-2 cursor-pointer text-sm btn-delete'
                      onClick={() => fmParams.setValue('filters', (prev: any[]) => prev.filter((_, indexRmFilter) => indexRmFilter != indexFilter))}
                    />
                  </div>
                )
              })}
              <div className='sm:h-8 -mr-2 opacity-0' />
            </div>
          </div>
        </div>
      </div>
      <div className={cn(
        // `sm:overflow-auto max-sm:border-t max-sm:pb-16`,
        `overflow-auto max-sm:border-t pb-16 w-full`,
        { 'section-table': type == 'carded-section' }, className
      )}>
        <table className={`table table-${(type ?? 'striped').replace('-section', '')}`}>
          <thead>
            {!(noHeader ?? ScreenWidth <= 640) && (
              <tr>
                {!!setSelectedRows && (
                  <th className={cn('row-selector', { '[&>input]:opacity-100': SelectedRows?.length })}>
                    <input
                      type="checkbox"
                      checked={SelectedRows?.length == dataPaginateds?.length}
                      onChange={(event) => {
                        if (event.target.checked) { setSelectedRows(dataPaginateds ?? []); } else { setSelectedRows([]); }
                      }}
                    />
                  </th>
                )}
                {!noNumber && <th style={{ width: "1px" }}>#</th>}
                {prototypeTable?.map((col, indexCol) => (<th key={indexCol} className={col.className} style={col.style}>{col.title}</th>))}
                {Boolean(actions) && (<th />)}
              </tr>
            )}
            {(showAdvanceSearch && ScreenWidth > 640) && (
              <tr>
                {!!setSelectedRows && <th key="onSelectRows" />}
                {!noNumber && <th key="noNumber" />}
                {prototypeTable?.map((col, indexCol) => {
                  const asConf = col.advanceSearch ?? {};
                  if (asConf?.name == "") return <th key={indexCol} />;
                  const fieldName = asConf?.name ?? `as_${typeof col.keyData == "string" ? col.keyData : col.title}`;
                  return (
                    <th key={indexCol}>
                      <InputText
                        noLabel name={fieldName}
                        defaultValue={fmParams.values[fieldName]}
                        onChange={(e) => {
                          if (refTOAdvanceSearch.current) {
                            clearTimeout(refTOAdvanceSearch.current[indexCol]);
                            refTOAdvanceSearch.current[indexCol] = setTimeout(() => fmParams.setValue(fieldName, e.target.value), 1000);
                          }
                        }}
                      />
                    </th>
                  );
                })}
                {Boolean(actions) && <th key="actions" />}
              </tr>
            )}
          </thead>
          <tbody>
            {((!dataPaginateds?.length) || (DataTables?.statusCode == 202)) ? (
              <tr className='empty-row'>
                <td
                  colSpan={(prototypeTable?.length ?? 0) + (noNumber ? 1 : 2)}
                  className="text-center text-gray-500 py-[4rem]"
                >
                  {(DataTables?.statusCode == 202) ? 'Loading...' : 'Data Kosong'}
                </td>
              </tr>
            ) : (
              dataPaginateds?.map((dataRow: any, indexDataRow) => {
                if (isValidElement(dataRow)) return <Fragment key={indexDataRow}>{dataRow}</Fragment>;
                const primaryValue = dataRow?.[primaryKey];
                rowNumber++;
                let currentActions = actions?.(dataRow, indexDataRow);
                if (!Array.isArray(currentActions)) currentActions = [];
                return (
                  <tr
                    key={indexDataRow}
                    className={cn({
                      'cursor-pointer': currentActions.includes('show'),
                      'bg-slate-50': ShowAction == primaryValue
                    })}
                    onClick={(event) => {
                      setTimeout(() => {
                        if (
                          currentActions.includes('show') &&
                          !(event.target as HTMLElement).closest('.prevent-show') &&
                          !(window?.getSelection()?.toString()?.trim() ?? '').length
                        ) {
                          if (onShow) {
                            onShow(dataRow);
                          } else {
                            router.push(`${pathName}${pathName.slice(-1) == '/' ? '' : '/'}${primaryValue}`);
                          }
                        }
                      }, 0);
                    }}
                  >
                    {/* checkbox select row */}
                    {!!setSelectedRows && (
                      <td className={cn('row-selector', { '[&>input]:opacity-100': SelectedRows?.length })}>
                        <input
                          type="checkbox"
                          checked={(SelectedRows ?? []).findIndex((rowSelected) => (rowSelected?.[primaryKey] == primaryValue)) >= 0}
                          onChange={(event) => {
                            setSelectedRows((prev) => {
                              const newSelectedRows = prev.filter((rowSelected: any) => (rowSelected?.[primaryKey] != primaryValue));
                              if (event.target.checked) newSelectedRows.push(dataRow);
                              return newSelectedRows;
                            })
                          }}
                        />
                      </td>
                    )}

                    {/* number row */}
                    {!noNumber && (
                      <td>{
                        ((fmParams?.values?.page || DataTables.paginate?.page || 1) - 1) *
                        (fmParams?.values?.per_page || DataTables.paginate?.per_page || 10) +
                        rowNumber
                      }</td>
                    )}

                    {/* data row */}
                    {prototypeTable?.map(({ keyData }, indexCol) => (<td key={indexCol}>{getDataCell(dataRow, keyData)}</td>))}

                    {/* btn action */}
                    {Boolean(currentActions.filter((action) => (!['show'].includes(action as any)))) && (
                      <td className='max-sm:align-top prevent-show relative'>
                        <div
                          className='h-[2rem] aspect-square max-sm:ml-auto rounded-full flex cursor-pointer hover:bg-sky-100'
                          onClick={() => setShowAction(primaryValue)}>
                          <DotsThreeOutlineVerticalIcon weight='fill' className='text-sm m-auto' />
                        </div>
                        <Dropdown
                          justHidden={true}
                          show={ShowAction == primaryValue} toHide={() => setShowAction(undefined)}
                          className='w-[8rem] -ml-[7rem] -mt-4 divide-y text-gray-600 text-sm rounded-md'>
                          {currentActions?.map((action, indexAct) => {
                            if ('edit' === action) {
                              return (
                                <Link
                                  key={indexAct}
                                  href={!onEdit ? `${pathName}${pathName.slice(-1) == '/' ? '' : '/'}form/${primaryValue}` : '#'}
                                  onClick={(e) => {
                                    if (onEdit) {
                                      e.preventDefault()
                                      onEdit(dataRow, indexDataRow)
                                    }
                                  }}
                                  className='flex items-center gap-1.5 py-1.5 px-2 hover:bg-gray-100'
                                >
                                  <NotePencilIcon weight='bold' className='text-base' />
                                  <span>Edit</span>
                                </Link>
                              )
                            } else if ('delete' === action) {
                              return (
                                <a
                                  key={indexAct}
                                  onClick={() => setShowConfirmDelete(primaryValue)}
                                  className='flex items-center gap-1.5 py-1.5 px-2 text-danger cursor-pointer hover:bg-gray-100'
                                >
                                  <TrashIcon weight='fill' className='text-base' />
                                  <span>Hapus</span>
                                </a>
                              )
                            }
                            return <Fragment key={indexAct}>{action}</Fragment>
                          })}
                        </Dropdown>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Confirm show={ShowConfirmDelete != null} toHide={() => setShowConfirmDelete(null)} onApproved={handleDelete} />

      <div className="grid grid-cols-4 items-center text-xs -mt-10">
        <div className="col-span-full sm:col-span-2 lg:col-span-1 lg:order-3 order-2">
          {!(noPerPage) && (
            <div className='flex sm:justify-end items-baseline max-sm:mb-3'>
              <div>Limitasi item: </div>
              <select
                className="text-sm font-medium cursor-pointer hover:bg-gray-100 rounded-md w-[5.25rem] pl-2 py-1"
                value={perPage}
                onChange={(e) => { fmParams?.setValues((prev) => ({ ...prev, page: 1, per_page: e.target.value })); }}
              >
                {[10, 50, 100, 500, 1000].map((count) => (<option key={count} className="pl-0" value={count}>{count} Data</option>))}
              </select>
            </div>
          )}
        </div>
        <div className="lg:col-span-2 col-span-full lg:order-2 order-3">
          {(!noPaginate && lastPage > 1) && (
            <ul className="flex flex-row lg:justify-center items-center gap-1 font-medium whitespace-nowrap">
              {prevPage >= 1 && (
                <div className={cnItem} onClick={() => onChangePage(prevPage)}><CaretLeftIcon /></div>
              )}

              {prevPage > 1 && nextPage < lastPage && (<div className={cnItem} onClick={() => onChangePage(1)}>1</div>)}
              {prevPage > 2 && (
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center">
                  <DotsThreeIcon weight='bold' />
                  <span className="sr-only">Selebihnya</span>
                </span>
              )}

              {(prevPage - 1) > 1 && nextPage > lastPage && (
                <div className={cnItem} onClick={() => onChangePage(prevPage - 1)}>{prevPage - 2}</div>
              )}
              {prevPage > 1 && nextPage >= lastPage && (
                <div className={cnItem} onClick={() => onChangePage(prevPage - 1)}>{prevPage - 1}</div>
              )}

              {prevPage >= 1 && (
                <div className={cn(cnItem, { border: prevPage == currentPage })} onClick={() => onChangePage(prevPage)}>
                  {prevPage}
                </div>
              )}
              <div className={cn(cnItem, "border")}>{currentPage}</div>
              {nextPage <= lastPage && (
                <div className={cn(cnItem, { border: nextPage == currentPage })} onClick={() => onChangePage(nextPage)}>
                  {nextPage}
                </div>
              )}

              {nextPage < lastPage && prevPage <= 1 && (
                <div className={cnItem} onClick={() => onChangePage(nextPage + 1)}>{nextPage + 1}</div>
              )}
              {(nextPage + 1) < lastPage && prevPage < 1 && (
                <div className={cnItem} onClick={() => onChangePage(nextPage + 1)}>{nextPage + 2}</div>
              )}

              {nextPage < (lastPage - 1) && (
                <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center">
                  <DotsThreeIcon weight="bold" />
                  <span className="sr-only">Selebihnya</span>
                </span>
              )}
              {nextPage < lastPage && prevPage > 1 && (
                <div
                  className={cn(cnItem, { border: lastPage == currentPage })} onClick={() => onChangePage(lastPage)}
                >{lastPage}</div>
              )}

              {nextPage <= lastPage && (
                <div className={cnItem} onClick={() => onChangePage(nextPage)}><CaretRightIcon /></div>
              )}
            </ul>
          )}
        </div>
        <div className='col-span-full sm:col-span-2 lg:col-span-1 order-1'>
          <div className="whitespace-nowrap flex items-center gap-1">
            <span>Menampilkan {sequenceFirstItemShowed + Number(Boolean(dataPaginateds?.length))}</span>
            <span>hingga {sequenceFirstItemShowed + (dataPaginateds?.length ?? 0)}</span>
            <span>dari {totalItem} data</span>
          </div>
        </div>
      </div>
    </>
  )
}
