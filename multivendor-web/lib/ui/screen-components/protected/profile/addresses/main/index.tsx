"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { DELETE_ADDRESS } from "@/lib/api/graphql/mutations";
import { useMutation, useQuery } from "@apollo/client";

import useToast from "@/lib/hooks/useToast";

import UserAddressComponent from "@/lib/ui/useable-components/address";
import CustomIconButton from "@/lib/ui/useable-components/custom-icon-button";
import AddressesSkeleton from "@/lib/ui/useable-components/custom-skeletons/addresses.skelton";
import CustomDialog from "@/lib/ui/useable-components/delete-dialog";
import EmptyAddress from "@/lib/ui/useable-components/empty-address";
import AddressItem from "../main/address-listings";

import { ISingleAddress } from "@/lib/utils/interfaces/profile.interface";

import { IUserAddress } from "@/lib/utils/interfaces";

import { GET_USER_PROFILE } from "@/lib/api/graphql";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";

export default function AddressesMain() {

  const t = useTranslations()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isUserAddressModalOpen, setIsUserAddressModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState<IUserAddress | null>(null);

  const { showToast } = useToast();

  const { data: profileData, loading: profileLoading } = useQuery(
    GET_USER_PROFILE,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const [
    mutate,
    { loading: loadingAddressMutation, error: deleteAddressError },
  ] = useMutation(DELETE_ADDRESS, {
    onCompleted,
  });

  function onCompleted() {
    showToast({
      type: "success",
      title: t("Deleted_successfullt_toast_title"),
      message: t("Deleted_successfullt_toast_label"),
      duration: 3000,
    });
    setDeleteTarget(null);
  }

  const addresses = profileData?.profile?.addresses || [];
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});



  const toggleDropdown = useCallback((addressId: string) => {
    setActiveDropdown((prev) => (prev === addressId ? null : addressId));
  }, []);


  const handleDeleteAddress = useCallback((addressId: string) => {
    setDeleteTarget(addressId);
  }, []);



  const handleConfirmDelete = useCallback(async () => {
    if (deleteTarget) {
      await mutate({ variables: { id: deleteTarget } });
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  const onEditAddress = (address: IUserAddress | null) => {
    setEditAddress(address);
    setIsUserAddressModalOpen(!!address);
  };



  useEffect(() => {
    if (deleteAddressError) {
      showToast({
        type: "error",
        title: t("Deleted_successfullt_toast_title"),
        message: t("failed_deleted_address"),
        duration: 3000,
      });
    }
  }, [deleteAddressError]);



  useEffect(() => {

    if (typeof window === "undefined") return;

    const handleClickOutside = (event: MouseEvent) => {
      const isOutside = addresses.every((address: ISingleAddress) => {
        const ref = dropdownRefs.current[address?._id];
        return !ref || !ref.contains(event.target as Node);
      });

      if (isOutside) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [addresses]);

  if (profileLoading) return <AddressesSkeleton />;

  return (
    <>
      <div className="w-full mx-auto">
        <CustomDialog
          onConfirm={handleConfirmDelete}
          onHide={() => setDeleteTarget(null)}
          visible={!!deleteTarget}
          loading={loadingAddressMutation}
        />
        {addresses?.map((address: IUserAddress) => (
          <AddressItem
            key={address?._id}
            address={address}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
            handleDelete={handleDeleteAddress}
            setDropdownRef={(id) => (el) => (dropdownRefs.current[id] = el)}
            onEditAddress={onEditAddress}
          />
        ))}
        {!addresses.length && <EmptyAddress />}

        <div className="flex justify-center mt-16">
          <CustomIconButton
            title={t('Add_new_address_title')}
            iconColor="black"
            classNames="bg-primary-color  w-[content] px-4"
            Icon={faPlus}
            loading={false}
            handleClick={() => {
              setIsUserAddressModalOpen(true);
            }}
          />
        </div>
      </div>

      <UserAddressComponent
        editAddress={editAddress}
        visible={isUserAddressModalOpen}
        onHide={() => setIsUserAddressModalOpen(false)}
      />
    </>
  );
}
