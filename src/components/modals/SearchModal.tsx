import type { MarkdownInstance } from 'astro';
import useSearchStore from '@utils/useSearchStore';
import { useCallback, useEffect, useRef, useState } from 'react';
import { HiMagnifyingGlassCircle } from 'react-icons/hi2';
import { RxCross2 } from 'react-icons/rx';

interface SearchModalProps {
	mdData: MarkdownInstance<Record<string, any>>[];
}

const SearchModal: React.FC<SearchModalProps> = ({ mdData }) => {
	// global store
	const searchStore = useSearchStore();

	// scroll
	const scrollContainerRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (scrollContainerRef.current) {
			scrollContainerRef.current.scrollTop =
				scrollContainerRef.current.scrollHeight;
		}
	}, []);

	// Search Logic
	const handleClose = useCallback(() => {
		searchStore.setOpenModal(false);
	}, [searchStore.openModal]);

	const [resultArray, setResultArray] = useState<
		MarkdownInstance<Record<string, any>>[]
	>([]);
	const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		searchStore.setSearchString(e.target.value);
		const results = mdData.filter(file =>
			file.file.includes(searchStore.searchValue)
		);
		setResultArray(results);
	};

	// exit out of the modal
	if (!searchStore.openModal) {
		return null;
	}

	return (
		<>
			<div
				className="fixed inset-0 z-50 flex items-center justify-center
				overflow-y-auto overflow-x-hidden bg-neutral-800/70 outline-none
				focus:outline-none">
				<div
					className="relative mx-auto my-6 h-full w-full md:h-auto md:w-4/6
				lg:h-auto lg:w-3/6 xl:w-2/5">
					<div
						className={`translate h-full duration-300 
						${searchStore.openModal ? `translate-y-0` : `translate-y-full`}
						${searchStore.openModal ? `opacity-100` : `opacity-0`}
						`}>
						<div
							className="translate relative flex h-full w-full flex-col
						rounded-lg border-0 bg-white shadow-lg outline-none
						focus:outline-none md:h-auto lg:h-auto">
							{/* Header */}
							<div
								className="relative flex items-center justify-between
							rounded-t p-6">
								<button
									onClick={handleClose}
									className="left-9 rounded-full border-0 bg-elixir-orange px-2 py-2 text-white transition
									hover:opacity-70">
									<RxCross2 />
								</button>
								<div className="text-lg">
									<input
										type="text"
										autoFocus
										placeholder="Serch"
										className="rounded-full bg-neutral-400/30 py-1 pl-3"
										onChange={handleOnChange}
									/>
								</div>
								<HiMagnifyingGlassCircle
									size={42}
									className="text-elixir-orange"
								/>
							</div>
							{/* Body */}
							<div
								className="relative flex-auto overflow-y-scroll p-6 lg:max-h-80"
								ref={scrollContainerRef}>
								{resultArray.map(file => (
									<ResultCard file={file} />
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default SearchModal;

interface ResultCardProp {
	file: MarkdownInstance<Record<string, any>>;
}
const ResultCard: React.FC<ResultCardProp> = ({ file }) => {
	return (
		<a href={file.url} className="rounded-lg drop-shadow-md">
			{file.file}
		</a>
	);
};
