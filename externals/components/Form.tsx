'use client'

import { DetailedHTMLProps, ElementType, FormEvent, FormEventHandler, Fragment, HTMLAttributes, HTMLInputTypeAttribute, ReactNode, isValidElement, useEffect, useState } from 'react'
import Button from './Button'
import Input, { typeInputProps } from './inputs/Input'
import { useContextGlobal } from '../contexts/ContextGlobal'
import { api, cn, onInvalid, onSubmitNormal, typeActionApi, useFormManager, validateForm } from '../utils/frontend'
import { toast } from 'react-toastify'
import { typeSelectProps } from './inputs/Select'
import Confirm from './popups/Confirm'



export interface typeFormInputProps extends Omit<typeInputProps, 'fm'> {
  parentProps?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
};
interface typeFormProps {
  fields: (ReactNode | (typeFormInputProps & typeSelectProps & {
    type?: HTMLInputTypeAttribute | 'select' | 'textarea';
    isBulk?: boolean;
  }))[];
  fm?: ReturnType<typeof useFormManager>;
  id?: string;
  className?: string;
  encType?: 'text/plain' | 'multipart/form-data' | 'application/x-www-form-urlencoded';
  noFooter?: boolean;
  noSubmit?: boolean;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  actionApi?: typeActionApi & {
    afterLoad?: (data: Response) => any;
    afterDelete?: (json: Record<string, any>) => any;
    onDelete?: () => any;
  },
  footerElement?: ReactNode;
}

export default function Form({
  fields,
  id,
  className,
  encType,
  noFooter,
  onSubmit,
  noSubmit,
  fm: fmExternal,
  actionApi,
  footerElement
}: typeFormProps) {
  const { setStatusCode } = useContextGlobal();
  const fm = fmExternal ?? useFormManager();



  /**
   * Function handler
   */
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Recheck invalid field
    const invalids = validateForm(fm);

    // On submit
    if (!Object.keys(invalids).length) {
      if (onSubmit) onSubmit(event);
      if (actionApi?.url) onSubmitNormal(event, fm, actionApi);
    }
  }

  const handleDelete = () => {
    if (actionApi?.onDelete) actionApi.onDelete();
    else if (actionApi?.url) {
      api({ method: 'DELETE', url: actionApi.url, body: { ids: actionApi.primaryKeyValue } }).then(async (res) => {
        if (res.status == 200) {
          fm.setConfirmDelete(null);
          fm.setValues({}, true);
          fm.setShow(false);
          toast.success((await res.json())?.message ?? 'Berhasil!');
        }
      });
    } else fm.setConfirmDelete(null);
  }



  /**
   * Use effect
   */
  useEffect(() => {
    if (actionApi?.url && actionApi.primaryKeyValue && fm?.statusCode == 204) {
      fm.setStatusCode(202);
      api({ url: `${actionApi?.url}/${actionApi.primaryKeyValue ?? ''}` }).then(async (res) => {
        if (res.status == 200) {
          fm.setStatusCode(200);
          fm.setValues(actionApi?.afterLoad ? actionApi?.afterLoad(res) : (await res.json())?.data ?? {});
        } else {
          setStatusCode(res.status);
        }
      })
    }
  }, [actionApi]);



  /**
   * Rendered JSX
   */
  const Wrapper: ElementType = noSubmit ? 'div' : 'form';
  return (
    <Wrapper onSubmit={handleSubmit as any} encType={encType} id={id} className={cn('grid grid-cols-12 gap-x-4 pb-4', className)}>
      <button className='hidden' ref={fm.btnSubmit as any} type='submit'></button>
      {(fields as typeFormInputProps[]).map((field, indexField) => {
        if (isValidElement(field)) {
          return (<Fragment key={indexField}>{field}</Fragment>);
        } else {
          const { parentProps, ...fieldProps } = field;
          return (
            <div key={indexField} {...parentProps} className={cn('col-span-12', parentProps?.className)}>
              <Input {...fieldProps} fm={fm} readOnly={fm.disable || fm.readOnly || fieldProps?.readOnly} />
            </div>
          );
        }
      })}
      {!noFooter && (!noSubmit || footerElement) && (
        <div className='col-span-full flex gap-2 mt-8 pt-4 border-t'>
          {!(noSubmit || fm.disable) && (<Button id={id ? `btn-submit-${id}` : undefined} children='Simpan' isLoading={fm?.statusCode == 202} />)}
          {footerElement}
        </div>
      )}
      <div className='[&>div]:w-screen [&>div]:h-screen [&>div]:mt-[-4rem] [&>div]:sm:mt-[-2rem] [&>div]:transform-[translateX(-50%)] [&>div]:left-1/2'>
        <Confirm
          show={Boolean(fm.confirmDelete)} toHide={() => fm.setConfirmDelete(null)} onApproved={handleDelete}
          question={`Data terpilih akan dihapus. Apakah anda yakin ingin melakukan hal ini?`}
        />
      </div>
    </Wrapper>
  )
}