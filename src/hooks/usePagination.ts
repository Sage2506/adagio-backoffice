import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import type { ILinks } from "../types/common";

interface PaginationData {
  pages: number[];
  links: ILinks;
  total?: number;
}

interface UsePaginationOptions {
  pageParam?: string;
  resourcePath?: string;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { pageParam = "page[page]", resourcePath } = options;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pages, setPages] = useState<number[]>([]);
  const [links, setLinks] = useState<ILinks>();
  const [totalEntries, setTotalEntries] = useState<number>(0);
  const searchString = searchParams.toString();

  const page = Number(searchParams.get(pageParam));
  const currentPage = Number.isInteger(page) && page > 0 ? page : 1;

  const setPagination = useCallback((data: PaginationData) => {
    setPages(data.pages);
    setLinks(data.links);
    if (data.total !== undefined) setTotalEntries(data.total);
  }, []);

  const resetPagination = useCallback((reload?: () => void | Promise<void>) => {
    if (currentPage === 1) {
      void reload?.();
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.delete(pageParam);
    navigate(`?${newParams.toString()}`, { replace: true });
  }, [currentPage, navigate, pageParam, searchParams]);

  const getPageTarget = useCallback((page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(pageParam, page.toString());
    return `?${newParams.toString()}`;
  }, [pageParam, searchParams]);

  const getLinkTarget = useCallback((link?: string) => {
    if (!link) return undefined;
    if (!resourcePath) return link;

    const resourceIndex = link.indexOf(resourcePath);
    return resourceIndex >= 0 ? link.slice(resourceIndex + resourcePath.length) : link;
  }, [resourcePath]);

  return useMemo(() => ({
    currentPage,
    pages,
    links,
    totalEntries,
    searchParams,
    searchString,
    setPagination,
    resetPagination,
    getPageTarget,
    getLinkTarget,
  }), [
    currentPage,
    pages,
    links,
    totalEntries,
    searchParams,
    searchString,
    setPagination,
    resetPagination,
    getPageTarget,
    getLinkTarget,
  ]);
}
    