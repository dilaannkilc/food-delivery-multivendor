
import { useMutation } from '@apollo/client';
import { useState } from 'react';

import { FilterMatchMode } from 'primereact/api';

import {
  IZoneResponse,
  IZonesResponse,
  IActionMenuItem,
  IQueryResult,
  IZoneMainComponentsProps,
} from '@/lib/utils/interfaces';

import { useConfiguration } from '@/lib/hooks/useConfiguration';

import CustomDialog from '@/lib/ui/useable-components/delete-dialog';
import Table from '@/lib/ui/useable-components/table';
import RidersTableHeader from '../header/table-header';

import { ZONE_TABLE_COLUMNS } from '@/lib/ui/useable-components/table/columns/zone-columns';

import { useQueryGQL } from '@/lib/hooks/useQueryQL';
import useToast from '@/lib/hooks/useToast';

import { DELETE_ZONE, GET_ZONES } from '@/lib/api/graphql';

import { generateDummyZones } from '@/lib/utils/dummy';
import { useTranslations } from 'next-intl';

export default function ZoneMain({
  setIsAddZoneVisible,
  setZone,
}: IZoneMainComponentsProps) {

  const t = useTranslations();
  const { showToast } = useToast();
  const { ISPAID_VERSION } = useConfiguration()

  const [deleteId, setDeleteId] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<IZoneResponse[]>([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState({
    global: { value: '' as string | null, matchMode: FilterMatchMode.CONTAINS },
  });

  const { data, loading } = useQueryGQL(GET_ZONES, {
    fetchPolicy: 'cache-and-network',
  }) as IQueryResult<IZonesResponse | undefined, undefined>;

  const [mutateDelete, { loading: mutationLoading }] = useMutation(
    DELETE_ZONE,
    {
      refetchQueries: [{ query: GET_ZONES }],
    }
  );

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const menuItems: IActionMenuItem<IZoneResponse>[] = [
    {
      label: t('Edit'),
      command: (data?: IZoneResponse) => {
        if (data) {
          setIsAddZoneVisible(true);
          setZone(data); 
        }
      },
    },
    {
      label: t('Delete'),
      command: (data?: IZoneResponse) => {
        if (data) {
          setDeleteId(data._id);
        }
      },
    },
  ];

  const handleDeleteZone = async () => {
    if (ISPAID_VERSION) {
      await mutateDelete({
        variables: { id: deleteId },
        onCompleted: () => {
          showToast({
            type: 'success',
            title: t('Delete Zone'),
            message: t('Zone has been deleted successfully'),
            duration: 3000,
          });
          setDeleteId('');
        },
      });
    } else {
      showToast({
        type: 'error',
        title: t('you_are_using_free_version'),
        message: t('this_Feature_is_only_Available_in_Paid_Version'),
      });
      setDeleteId('');
    }

  }

  return (
    <div className="pt-5">
      <Table
        header={
          <RidersTableHeader
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
          />
        }
        data={data?.zones || (loading ? generateDummyZones() : [])}
        filters={filters}
        setSelectedData={setSelectedProducts}
        selectedData={selectedProducts}
        loading={loading}
        columns={ZONE_TABLE_COLUMNS({ menuItems })}
      />
      <CustomDialog
        loading={mutationLoading}
        visible={!!deleteId}
        onHide={() => {
          setDeleteId('');
        }}
        onConfirm={() => {
          handleDeleteZone()
        }}
        message={t('Are you sure you want to delete this item?')}
      />
    </div>
  );
}
