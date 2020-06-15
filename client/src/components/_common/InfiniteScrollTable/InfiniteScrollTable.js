import React from 'react';
import { useTable } from 'react-table';
import PropTypes from 'prop-types';
import LoadingSpinner from '../LoadingSpinner';
import './InfiniteScrollTable.module.scss';

const rowContentPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.element,
  PropTypes.oneOf([React.Fragment])
]);

const InfiniteScrollLoadingRow = ({ isLoading }) => {
  if (!isLoading) {
    return null;
  }
  return (
    <tr styleName="status">
      <td>
        <LoadingSpinner placement="inline" />
      </td>
    </tr>
  );
};
InfiniteScrollLoadingRow.propTypes = {
  isLoading: PropTypes.bool.isRequired
};

const InfiniteScrollNoDataRow = ({ display, noDataText }) => {
  if (!display) {
    return null;
  }
  return (
    <tr styleName="status">
      <td>
        <span styleName="status__message">{noDataText}</span>
      </td>
    </tr>
  );
};
InfiniteScrollNoDataRow.propTypes = {
  display: PropTypes.bool.isRequired,
  noDataText: rowContentPropType.isRequired
};

const InfiniteScrollTable = ({
  tableColumns,
  tableData,
  onInfiniteScroll,
  isLoading,
  className,
  noDataText
}) => {
  // tableData = [];
  // isLoading = true;
  const columns = React.useMemo(() => tableColumns, []);
  const data = React.useMemo(() => tableData, [tableData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data });

  const onScroll = ({ target }) => {
    const bottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;
    if (bottom && target.scrollTop > 0) {
      onInfiniteScroll(tableData.length);
    }
  };

  return (
    <table
      {...getTableProps()}
      styleName="root"
      className={`${className}  o-fixed-header-table`}
    >
      <thead>
        {headerGroups.map(headerGroup => (
          <tr
            {...headerGroup.getHeaderGroupProps()}
            className="o-fixed-header-table__row"
          >
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody
        {...getTableBodyProps()}
        onScroll={onScroll}
        className="o-fixed-header-table__body"
      >
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className="o-fixed-header-table__row">
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
        <InfiniteScrollLoadingRow isLoading={isLoading} />
        <InfiniteScrollNoDataRow
          display={!isLoading && tableData.length === 0}
          noDataText={noDataText}
        />
      </tbody>
    </table>
  );
};

InfiniteScrollTable.propTypes = {
  tableColumns: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  tableData: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onInfiniteScroll: PropTypes.func,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  noDataText: rowContentPropType
};
InfiniteScrollTable.defaultProps = {
  onInfiniteScroll: offset => {},
  isLoading: false,
  className: '',
  noDataText: ''
};

export default InfiniteScrollTable;
