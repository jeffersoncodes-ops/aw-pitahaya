import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface EmptyStateAction {
  label: string;
  to: string;
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  action?: EmptyStateAction;
}

function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 2,
      }}
    >
      {icon && (
        <Box sx={{ fontSize: 64, mb: 2, color: 'text.disabled' }}>
          {icon}
        </Box>
      )}
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      {message && (
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
          {message}
        </Typography>
      )}
      {action && (
        <Button
          variant="contained"
          component={RouterLink}
          to={action.to}
        >
          {action.label}
        </Button>
      )}
    </Box>
  );
}

export default EmptyState;
