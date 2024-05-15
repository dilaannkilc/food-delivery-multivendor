import { DataTablePageEvent, DataTableRowClickEvent } from 'primereact/datatable';
import React, { useMemo, useState, useEffect } from 'react';
import Table from '@/lib/ui/useable-components/table';
import { ORDER_SUPER_ADMIN_COLUMNS } from '@/lib/ui/useable-components/table/columns/order-superadmin-columns';
import OrderTableSkeleton from '@/lib/ui/useable-components/custom-skeletons/orders.vendor.row.skeleton';
import { IExtendedOrder, IOrder } from '@/lib/utils/interfaces';
import { TOrderRowData } from '@/lib/utils/types';
import { DataTableFilterMeta } from 'primereact/datatable';

interface OrderTableProps {
  data: {
    orders: IOrder[];
    totalCount: number;
    currentPage: number;
    totalPages: number;
    prevPage: number | null;
    nextPage: number | null;
  } | undefined;
  loading: boolean;
  isInitialLoad: boolean; 
  handleRowClick: (event: DataTableRowClickEvent) => void; 
  selectedData: IExtendedOrder[];
  setSelectedData: React.Dispatch<React.SetStateAction<IExtendedOrder[]>>;
  first: number;
  rows: number;
  onPage: (e: DataTablePageEvent) => void;
  filters?: DataTableFilterMeta;
  globalFilterValue?: string;
}

export default function OrderTable({
  data,
  loading,
  isInitialLoad, 
  handleRowClick,
  selectedData,
  setSelectedData,
  rows,
  onPage,
  filters,
}: OrderTableProps) {



  const [lastValidOrders, setLastValidOrders] = useState<IOrder[]>([]);

  useEffect(() => {
    if (!loading && data?.orders) {
      setLastValidOrders(data.orders);
    }
  }, [loading, data?.orders]);

  const displayData: TOrderRowData[] = useMemo(() => {
    if (loading && isInitialLoad) { 
      return OrderTableSkeleton({ rowCount: 10 }); 
    }

    if (loading && !isInitialLoad && !data?.orders) {
      return lastValidOrders.map(
        (order: IOrder): IExtendedOrder => ({
          ...order,
          itemsTitle:
            order?.items
              .map((item) => item?.title)
              .join(', ')
              .slice(0, 15) + '...',
          OrderdeliveryAddress:
            order?.deliveryAddress?.deliveryAddress?.toString()?.slice(0, 15) + '...',
          DateCreated: order?.createdAt?.toString()?.slice(0, 10),
        })
      );
    }

    if (!data?.orders) return [];

    return data.orders.map(
      (order: IOrder): IExtendedOrder => ({
        ...order,
        itemsTitle:
          order?.items
            .map((item) => item?.title)
            .join(', ')
            .slice(0, 15) + '...',
        OrderdeliveryAddress:
          order?.deliveryAddress?.deliveryAddress?.toString()?.slice(0, 15) + '...',
        DateCreated: order?.createdAt?.toString()?.slice(0, 10),
      })
    );
  }, [data, loading, isInitialLoad, lastValidOrders]); 

  return (
    <Table
      data={displayData as IExtendedOrder[]}
      setSelectedData={setSelectedData}
      selectedData={selectedData}
      columns={ORDER_SUPER_ADMIN_COLUMNS()}
      loading={loading}
      handleRowClick={handleRowClick}
      moduleName={'SuperAdmin-Order'}
      totalRecords={data?.totalCount || 0}
      onPageChange={(page, pageSize) => {
        onPage({
          first: (page - 1) * pageSize,
          rows: pageSize,
          page: page - 1,
          pageCount: Math.ceil((data?.totalCount || 0) / pageSize),
        } as DataTablePageEvent);
      }}
      currentPage={data?.currentPage || 1}
      rowsPerPage={rows}
      filters={filters}
      globalFilterFields={['orderId', 'orderStatus', 'restaurant.name', 'deliveryAddress.deliveryAddress']}
    />
  );
}
