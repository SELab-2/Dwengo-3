import {
  Box,
  Divider,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  Typography,
} from '@mui/material';

interface PaginatorProps<T> {
  data: T[]; // Data for the current page
  page: number; // Current page
  totalPages: number; // Total number of pages
  pageSize: number; // Current page size
  setPage: (page: number) => void; // Callback to update the page
  setPageSize: (pageSize: number) => void; // Callback to update the page size
  renderItem: (item: T) => React.ReactNode; // Function to render each item
  renderContainer?: (children: React.ReactNode) => React.ReactNode; // Function to render the container
}

/**
 *
 * @param data - Data for the current page (array of items)
 * @param page - Current page number
 * @param totalPages - Total number of pages
 * @param pageSize - Number of items per page
 * @param setPage - Function to set the current page
 * @param setPageSize - Function to set the page size
 * @param renderItem - Function to render each item
 * @param renderContainer - Function to render the container (optional)
 * @returns
 */
function Paginator<T>({
  data,
  page,
  totalPages,
  pageSize,
  setPage,
  setPageSize,
  renderItem,
  renderContainer = (children) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2, // Add spacing between items
        width: '100%',
      }}
    >
      {children}
    </Box>
  ), // Default container is a vertical box
}: PaginatorProps<T>) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2, // Add spacing between items and pagination controls
        width: '100%',
      }}
    >
      <Divider sx={{ width: '100%' }} />

      {/* Pagination Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          gap: 3, // Add spacing between pagination and page size selector
        }}
      >
        {/* Pagination (centered horizontally) */}
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => {
            setPage(value);
          }}
          color="primary"
          showFirstButton
          showLastButton
          renderItem={(item) => <PaginationItem {...item} />}
        />

        {/* Page Size Selector */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1, // Add spacing between "Page Size" text and dropdown
          }}
        >
          <Typography variant="body2">Page Size:</Typography>
          <Select
            value={pageSize}
            onChange={(event) => setPageSize(Number(event.target.value))}
            size="small"
          >
            {[2, 5, 10, 20, 50].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Render the container with items */}
      {renderContainer(data.map((item) => renderItem(item)))}

      <Divider sx={{ width: '100%' }} />
    </Box>
  );
}

export default Paginator;
