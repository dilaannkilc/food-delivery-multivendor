
import { IDataTableProps, ITableExtends } from "@/lib/utils/interfaces";

import { Column } from "primereact/column";
import {
  DataTable,
  DataTableSelectionMultipleChangeEvent,
  DataTablePageEvent,
} from "primereact/datatable";
import DataTableColumnSkeleton from "../custom-skeletons/datatable.column.skeleton";
import { useTranslations } from "next-intl";

const Table = <T extends ITableExtends>({
  header,
  data,
  selectedData,
  setSelectedData,
  columns,
  filters,
  size = "small",
  loading,
  isSelectable = false,
  moduleName = "Restaurant-Orders",
  handleRowClick,
  rowsPerPage = 10,
  onPage,
  className,

  sortField,
  sortOrder,
  scrollable = true,
  scrollHeight = "420px",

  totalRecords,
  onPageChange,
  currentPage = 1,
}: IDataTableProps<T>) => {
  const handleSelectionChange = (
    e: DataTableSelectionMultipleChangeEvent<T[]>
  ) => {
    setSelectedData(e.value);
  };

  const t = useTranslations();

  const handlePageChange = (event: DataTablePageEvent) => {
    if (onPageChange) {

      const page = Math.floor(event.first / event.rows) + 1;
      onPageChange(page, event.rows);
    }
  };

  const isServerPaginated = Boolean(onPageChange && totalRecords !== undefined);

  const rowClassName = (data: T) => {
    let className = "";
    switch (moduleName) {
      case "Restaurant-Order":
        className = data?.orderStatus === "ASSIGNED" ? "row-assigned" : "";
        break;
      case "SuperAdmin-Order":
        className = data?.orderStatus === "ASSIGNED" ? "row-assigned" : "";
        break;
      default:
        break;
    }
    return `${className} ${handleRowClick ? "hover-clickable-row" : ""}`;
  };

  const paginationProps =
    isServerPaginated ?
      {
        first: (currentPage - 1) * rowsPerPage,
        lazy: true,
        totalRecords,
        onPage: handlePageChange,
      }
    : {};

  return (
    <>
      <DataTable
        header={header}
        paginator
        rows={rowsPerPage}
        sortField={sortField}
        sortOrder={sortOrder}
        rowsPerPageOptions={[10, 15, 25, 50]}
        onPage={onPage}
        value={data}
        selectionAutoFocus={true}
        size={size}
        selection={selectedData}
        onSelectionChange={handleSelectionChange}
        className={className}
        dataKey="_id"
        tableStyle={{
          minWidth: "50rem",
          minHeight: "auto",
          maxHeight: "480px",
        }}
        selectionMode={isSelectable ? "checkbox" : null}
        filters={filters}
        scrollable={scrollable}
        scrollHeight={scrollHeight}
        removableSort
        rowClassName={rowClassName}
        onRowClick={handleRowClick}
        emptyMessage={t("No Data Available")}
        {...paginationProps} 
      >
        {isSelectable && (
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
        )}
        {columns.map((col, index) => (
          <Column
            key={index}
            field={col.propertyName}
            header={col.headerName}
            sortable={!col.propertyName.includes("action")}
            hidden={col.hidden}
            bodyClassName="selectable-column"
            body={loading ? <DataTableColumnSkeleton /> : col.body}
          />
        ))}
      </DataTable>
    </>
  );
};

export default Table;
