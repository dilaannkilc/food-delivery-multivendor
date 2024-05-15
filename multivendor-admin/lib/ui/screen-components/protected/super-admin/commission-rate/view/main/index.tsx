
import { GET_COMMISSION_RATES_PAGINATED, updateCommission } from '@/lib/api/graphql';

import { ToastContext } from '@/lib/context/global/toast.context';

import { useQueryGQL } from '@/lib/hooks/useQueryQL';

import Table from '@/lib/ui/useable-components/table';



import { IQueryResult, ICommissionRateRestaurantResponse, IPaginationCommissionRateVars } from '@/lib/utils/interfaces';

import { useMutation } from '@apollo/client';

import { useContext, useEffect, useState } from 'react';

import { COMMISSION_RATE_ACTIONS } from '@/lib/utils/constants';

import CommissionRateHeader from '../header/table-header';
import { useTranslations } from 'next-intl';
import { COMMISSION_RATE_COLUMNS } from '@/lib/ui/useable-components/table/columns/comission-rate-columns';

interface CommissionRateData {
  commissionRate: {
    restaurant: ICommissionRateRestaurantResponse[];
    currentPage: number;
    totalPages: number;
    nextPage: boolean;
    prevPage: boolean;
  };
}

export default function CommissionRateMain() {

  const t = useTranslations();

  const [restaurants, setRestaurants] = useState<ICommissionRateRestaurantResponse[] | null>(null);
  const [editingRestaurantIds, setEditingRestaurantIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedRestaurants, setSelectedRestaurants] = useState<
    ICommissionRateRestaurantResponse[]
  >([]);
  const [loadingRestaurant, setLoadingRestaurant] = useState<string | null>(
    null
  );
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { showToast } = useContext(ToastContext);

  const { data, error, refetch, loading } = useQueryGQL(
    GET_COMMISSION_RATES_PAGINATED,
    { page: currentPage, limit: rowsPerPage },
    {
      fetchPolicy: 'network-only',
    }
  ) as IQueryResult<CommissionRateData | undefined, IPaginationCommissionRateVars>;

  const [updateCommissionMutation] = useMutation(updateCommission);

  const handleSave = async (restaurantId: string) => {
    const restaurant = restaurants?.find((r) => r._id === restaurantId);
    if (!restaurant?.commissionRate) {
      return showToast({
        type: 'error',
        title: t('Commission Updated'),
        message: `${t('Commission')} ${t('Update')} ${t('failed')}`,
      });
    }
    if (restaurant) {
      setLoadingRestaurant(restaurantId);
      if (restaurant?.commissionRate > 100) {
        setLoadingRestaurant(null);
        return showToast({
          type: 'error',
          title: t('Commission Updated'),
          message: t(
            'As commission rate is a %age value so it cannot exceed a max value of 100'
          ),
        });
      }
      try {
        await updateCommissionMutation({
          variables: {
            id: restaurantId,
            commissionRate: parseFloat(String(restaurant?.commissionRate)),
          },
        });
        showToast({
          type: 'success',
          title: t('Commission Updated'),
          message: `${t('Commission rate updated for')} ${restaurant.name}`,
          duration: 2000,
        });
        setEditingRestaurantIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(restaurantId);
          return newSet;
        });
        refetch();
      } catch (error) {
        showToast({
          type: 'error',
          title: t('Error'),
          message: `${t('Error updating commission rate for')} ${restaurant.name}`,
          duration: 2000,
        });
      } finally {
        setLoadingRestaurant(null);
      }
    }
  };

  const handleCommissionRateChange = (restaurantId: string, value: number) => {
    setRestaurants((prevRestaurants) =>
      prevRestaurants
        ? prevRestaurants.map((restaurant) =>
          restaurant._id === restaurantId
            ? { ...restaurant, commissionRate: value }
            : restaurant
        )
        : null
    );
    setEditingRestaurantIds((prev) => {
      const newSet = new Set(prev);
      newSet.add(restaurantId);
      return newSet;
    });
  };

  const getFilteredRestaurants = () => {
    if (!restaurants) return [];
    return restaurants.filter((restaurant) => {
      const nameMatches = restaurant.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      if (editingRestaurantIds.has(restaurant._id)) {
        return true;
      }

      if (!nameMatches) {
        return false;
      }

      if (selectedActions.length === 0) {
        return true;
      }

      return selectedActions.some((action) => {
        switch (action) {
          case COMMISSION_RATE_ACTIONS.MORE_THAN_5:
            return restaurant.commissionRate > 5;
          case COMMISSION_RATE_ACTIONS.MORE_THAN_10:
            return restaurant.commissionRate > 10;
          case COMMISSION_RATE_ACTIONS.MORE_THAN_20:
            return restaurant.commissionRate > 20;
          default:
            return false;
        }
      });
    });
  };

  useEffect(() => {
    if (data?.commissionRate?.restaurant) {
      setRestaurants(data.commissionRate.restaurant);
    } else if (error) {
      showToast({
        type: 'error',
        title: t('Error Fetching Restaurants'),
        message: t(
          'An error occurred while fetching restaurants. Please try again later.'
        ),
        duration: 2000,
      });
    }
  }, [data, error]);

  return (
    <div className="p-3">
      <Table
        data={
          (loading || restaurants === null) ? [] : getFilteredRestaurants()
        }
        setSelectedData={setSelectedRestaurants}
        selectedData={selectedRestaurants}
        columns={COMMISSION_RATE_COLUMNS({
          handleSave,
          handleCommissionRateChange,
          loadingRestaurant,
        })}
        loading={loading || restaurants === null}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        totalRecords={(data?.commissionRate?.totalPages || 0) * rowsPerPage} 
        onPageChange={(page, rows) => {
          setCurrentPage(page);
          setRowsPerPage(rows);
        }}
        header={
          <CommissionRateHeader
            selectedActions={selectedActions}
            setSelectedActions={setSelectedActions}
            onSearch={setSearchTerm}
          />
        }
      />
    </div>
  );
}
