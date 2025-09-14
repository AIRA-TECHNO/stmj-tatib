'use client'

import { DetailedHTMLProps, ElementType, FormEventHandler, Fragment, HTMLAttributes, HTMLInputTypeAttribute, ReactNode, isValidElement, useEffect } from 'react'
import Button from './Button'
import Input, { typeInputProps } from './inputs/Input'
import { useContextGlobal } from '../contexts/ContextGlobal'
import { api, cn, onInvalid, useFormManager, validateForm } from '../utils/frontend'
import { toast } from 'react-toastify'
import { typeSelectProps } from './inputs/Select'



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
  noSubmit?: boolean;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  submitConfig?: {
    url: string;
    method?: string;
    onSuccess: (responseJson: Record<string, any>) => any;
    customBodyRequest?: (formData: FormData) => any;
  };
  sourceDefaultValue?: {
    url: string;
    keyResponseJson?: string;
  };
  footerElement?: ReactNode;
}

export default function Form({
  fields,
  id,
  className,
  encType,
  onSubmit,
  noSubmit,
  fm: fmExternal,
  submitConfig,
  sourceDefaultValue,
  footerElement
}: typeFormProps) {
  const { setStatusCode } = useContextGlobal();
  const fm = fmExternal ?? useFormManager();



  /**
   * Function handler
   */
  const handleSubmit: FormEventHandler<any> = (event) => {
    event.preventDefault();

    // Recheck invalid field
    const invalids = validateForm(fm);

    // On submit
    if (!Object.keys(invalids).length) {
      if (onSubmit) onSubmit(event);
      if (submitConfig?.url) {
        fm?.setStatusCode(202);
        const formData = new FormData(event.target as HTMLFormElement);
        api({
          url: submitConfig?.url,
          method: submitConfig?.method ?? 'POST',
          body: submitConfig.customBodyRequest ? submitConfig.customBodyRequest(formData) : formData
        }).then(async (res) => {
          fm?.setStatusCode(res.status);
          if (res.status == 200) {
            submitConfig.onSuccess(await res.json());
          } else {
            const { invalids, message } = (await res.json());
            toast.error(message);
            fm?.setInvalids((prev) => ({ ...prev, ...onInvalid(invalids) }));
          }
        });
      }
    }
  }



  /**
   * Use effect
   */
  useEffect(() => {
    if (
      sourceDefaultValue?.url &&
      !Object.values(fm.values ?? {})?.filter(Boolean)?.length &&
      fm?.statusCode != 202
    ) {
      fm.setStatusCode(202);
      api({ url: sourceDefaultValue.url }).then(async (res) => {
        if (res.status == 200) {
          fm.setStatusCode(200);
          fm.setValues((await res.json())?.[sourceDefaultValue?.keyResponseJson ?? 'data'] ?? {});
        } else {
          setStatusCode(res.status);
        }
      })
    }
  }, [sourceDefaultValue])



  /**
   * Rendered JSX
   */
  const Wrapper: ElementType = noSubmit ? 'div' : 'form';
  return (
    <Wrapper
      onSubmit={handleSubmit} encType={encType} ref={fm.formElement as any}
      id={id} className={cn('grid grid-cols-12 gap-x-4 pb-4', className)}
    >
      {(fields as typeFormInputProps[]).map((field, indexField) => {
        if (isValidElement(field)) {
          return (<Fragment key={indexField}>{field}</Fragment>);
        } else {
          const { parentProps, ...fieldProps } = field;
          return (
            <div
              key={indexField} {...parentProps}
              className={cn('col-span-12', parentProps?.className)}
            >
              <Input {...fieldProps} fm={fm} readOnly={fm.disable || fm.readOnly || fieldProps?.readOnly} />
            </div>
          );
        }
      })}
      {(!(noSubmit || fm.disable || fm.readOnly) || footerElement) && (
        <div className='col-span-full flex gap-2 mt-8 pt-4 border-t'>
          {!(noSubmit || fm.disable) && (
            <Button
              id={id ? `btn-submit-${id}` : undefined}
              children='Simpan'
              isLoading={fm?.statusCode == 202}
            />
          )}
          {footerElement}
        </div>
      )}
    </Wrapper>
  )
}