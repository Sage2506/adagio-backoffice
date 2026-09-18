import { NavLink } from "react-router";
import type { ILinks } from "../../types/common";

interface PaginationComponentProps {
	currentPage: number;
	pages: number[];
	links?: ILinks;
	isLoading: boolean;
	totalEntries?: number;
	currentItems?: number;
	pageSize?: number;
	getPageTarget: (page: number) => string;
	getLinkTarget: (link?: string) => string | undefined;
}

export default function PaginationComponent({
	currentPage,
	pages,
	links,
	isLoading,
	totalEntries,
	currentItems,
	pageSize = 10,
	getPageTarget,
	getLinkTarget,
}: PaginationComponentProps) {
	const firstItem = totalEntries === undefined || totalEntries === 0 ? 0 : (currentPage - 1) * pageSize + 1;
	const lastItem = totalEntries === undefined || totalEntries === 0 ? 0 : firstItem + (currentItems ?? 0) - 1;

	return (
		<div className="px-6 py-4 flex items-center justify-between border-t border-outline-variant bg-surface">
			{totalEntries !== undefined &&
				<div className="text-label-md font-label-md text-on-surface-variant">
					Showing {firstItem} to {lastItem} of {totalEntries} entries
				</div>
			}
			<nav
				className={`flex gap-1 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
				aria-busy={isLoading}
				aria-live="polite"
				aria-label="Table navigation">
				{links &&
					<NavLink
						to={getLinkTarget(links.first)!}
						className={`px-3 py-1 rounded border ${currentPage === 1
							? 'border-primary bg-primary-container text-on-primary-container font-bold'
							: 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
							}`}>
						First
					</NavLink>
				}
				{links?.prev &&
					<NavLink
						to={getLinkTarget(links.prev)!}
						className="px-3 py-1 rounded border">
						Previous
					</NavLink>
				}
				{pages.map(page =>
					<NavLink
						key={`page_${page}`}
						aria-current={currentPage === page ? 'page' : 'false'}
						to={getPageTarget(page)}
						className={`px-3 py-1 rounded border ${currentPage === page
							? 'border-primary bg-primary-container text-on-primary-container font-bold'
							: 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
							}`}>
						{page}
					</NavLink>
				)}
				{links?.next &&
					<NavLink
						to={getLinkTarget(links.next)!}
						className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
						Next
					</NavLink>
				}
				{links &&
					<NavLink
						to={getLinkTarget(links.last)!}
						className="px-3 py-1 rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container">
						Last
					</NavLink>
				}
			</nav>
		</div>
	);
}
