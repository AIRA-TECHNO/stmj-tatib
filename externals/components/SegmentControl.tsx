import React, { Dispatch, SetStateAction, useEffect } from 'react'

interface typeSegmentControlParams {
  segmentNavigations: Array<{
    label: string,
    value: any
  }>,
  onChange: (newValue: any) => any,
  value: any,
  className?: string
}
export default function SegmentControl({ segmentNavigations, onChange, value, className }: typeSegmentControlParams) {
  useEffect(() => {
    if ((!value) && (segmentNavigations?.length)) {
      onChange(segmentNavigations[0].value)
    }
  }, [segmentNavigations])

  return (
    <div className={`radio-switch ${className}`}>
      {segmentNavigations.map((segment, indexSegment) => (
        <div
          key={indexSegment} onClick={() => onChange(segment?.value)}
          className={segment?.value == value ? 'bg-white' : 'hover:text-primary'}
        >
          {segment?.label}
        </div>
      ))}
    </div>
  )
}
