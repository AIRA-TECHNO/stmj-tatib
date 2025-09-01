import { MagnifyingGlassIcon } from "@phosphor-icons/react"
import { DetailedHTMLProps, FocusEventHandler, InputHTMLAttributes, useRef } from "react"
import { cn } from "../utils/frontend"

export default function Search({
	onSubmit,
	className,
	placeholder,
	delay,
	...props
}: Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onSubmit'> & {
	onSubmit?: (value: string, field?: HTMLDivElement | null) => any;
	delay?: number;
}) {
	const refSearch = useRef<HTMLInputElement>(null);
	const refDelay = useRef<NodeJS.Timeout>(null);
	return (
		<div className={`flex items-center grow`}>
			<input
				ref={refSearch}
				className={cn(
					'sm:text-sm',
					'max-sm:bg-gray-100/50 h-10',
					'input-form px-4 border-primary/70', className
				)}
				placeholder={placeholder ?? 'Search...'}
				onInput={(e) => {
					const value = e.currentTarget.value
					if (refDelay.current) clearTimeout(refDelay.current);
					refDelay.current = setTimeout(() => { if (onSubmit) onSubmit(value); }, delay ?? 1000);
				}}
				{...props}
			/>
			<div
				onClick={() => {
					if (onSubmit) onSubmit(refSearch.current?.value ?? '', refSearch.current);
					if (refDelay.current) clearTimeout(refDelay.current);
				}}
				className='my-auto ml-[-2rem] w-[1.5rem] cursor-pointer text-[1.25rem] text-gray-400 hover:text-white'
			>
				<MagnifyingGlassIcon className="text-xl" />
			</div>
		</div>
	)
}


