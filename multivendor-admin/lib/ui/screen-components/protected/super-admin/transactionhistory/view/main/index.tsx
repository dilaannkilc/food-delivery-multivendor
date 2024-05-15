

import { useEffect, useState } from 'react';

import { FilterMatchMode } from 'primereact/api';

import TransactionHistoryTableHeader from '../header/table-header';
import Table from '@/lib/ui/useable-components/table';
import { TRANSACTION_HISTORY_COLUMNS } from '@/lib/ui/useable-components/table/columns/transaction-history-columns';

import {
  ITransactionHistory,
  ITransactionHistoryResponse,
  ITransactionHistoryFilters,
  IQueryResult,
} from '@/lib/utils/interfaces';
import { IActionMenuItem } from '@/lib/utils/interfaces/action-menu.interface';

import { GET_TRANSACTION_HISTORY } from '@/lib/api/graphql';
import { useQuery } from '@apollo/client';
import { generateSkeletonTransactionHistory } from '@/lib/utils/dummy';
import TransactionDetailModal from '@/lib/ui/useable-components/popup-menu/transaction-history-modal.module';
import { useTranslations } from 'next-intl';
import useDebounce from '@/lib/hooks/useDebounce';

export default function TransactionHistoryMain() {

  const t = useTranslations();

  const [selectedTransactions, setSelectedTransactions] = useState<
    ITransactionHistory[]
  >([]);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransactionHistory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: {
      value: null as string | null,
      matchMode: FilterMatchMode.CONTAINS,
    },
  });

  const debouncedSearch = useDebounce(globalFilterValue);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [dateFilters, setDateFilters] = useState<ITransactionHistoryFilters>({
    startingDate: '',
    endingDate: '',
    userType: undefined,
    userId: '',
  });

  const [openMenuId, setOpenMenuId] = useState<string>('');

  const { data, loading, refetch } = useQuery(GET_TRANSACTION_HISTORY, {
    variables: {
      pageSize: pageSize + 30, 
      pageNo: currentPage, 
      startingDate: dateFilters.startingDate || undefined,
      endingDate: dateFilters.endingDate || undefined,
      ...(dateFilters.userType !== 'ALL' && { userType: dateFilters.userType }),
    },
  }) as unknown as IQueryResult<ITransactionHistoryResponse | undefined, any>;

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const onPageChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const menuItems: IActionMenuItem<ITransactionHistory>[] = [
    {
      label: t('View Details'),
      command: (data?: ITransactionHistory) => {
        if (data) {
          setSelectedTransaction(data);
          setIsModalOpen(true);
        }
      },
    },
  ];

  const transactionData = data?.transactionHistory?.data;

  useEffect(() => {
    refetch({ search: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <div className="p-3">
      <Table
        header={
          <TransactionHistoryTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            dateFilters={dateFilters}
            setDateFilters={setDateFilters}
          />
        }
        data={
          transactionData ||
          (loading ? generateSkeletonTransactionHistory() : [])
        }
        filters={filters}
        setSelectedData={setSelectedTransactions}
        selectedData={selectedTransactions}
        loading={loading}
        columns={TRANSACTION_HISTORY_COLUMNS({
          menuItems,
          openMenuId,
          setOpenMenuId,
        })}
        totalRecords={data?.transactionHistory?.pagination?.total}
        onPageChange={onPageChange}
        currentPage={currentPage}
        rowsPerPage={pageSize}
      />
      <TransactionDetailModal
        visible={isModalOpen}
        onHide={() => setIsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}
