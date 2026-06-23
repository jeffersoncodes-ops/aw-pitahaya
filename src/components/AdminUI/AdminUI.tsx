import { Box, Typography, Button, TableHead, TableRow, TableCell } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

interface PrimaryBtnProps {
  children: React.ReactNode;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'contained' | 'outlined';
  sx?: SxProps<Theme>;
}

export const PrimaryButton = ({
  children,
  onClick,
  size = 'small',
  variant = 'contained',
  sx,
}: PrimaryBtnProps) => (
  <Button variant={variant} size={size} onClick={onClick} color="primary" sx={{ ...sx }}>
    {children}
  </Button>
);

interface SectionHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export const SectionHeader = ({ title, children }: SectionHeaderProps) => (
  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
    <Typography variant="h6" gutterBottom sx={{ m: 0 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

interface ColDef {
  label: string;
}

export const StyledTableHead = ({ columns }: { columns: ColDef[] }) => (
  <TableHead sx={{ bgcolor: 'primary.main' }}>
    <TableRow>
      {columns.map((c) => (
        <TableCell key={c.label} sx={{ color: 'white', fontWeight: 'bold' }}>
          {c.label}
        </TableCell>
      ))}
    </TableRow>
  </TableHead>
);

interface ActionBtnsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export const EditDeleteActions = ({ onEdit, onDelete }: ActionBtnsProps) => (
  <Box sx={{ display: 'flex', gap: 0.5 }}>
    <Button size="small" variant="outlined" onClick={onEdit}>
      Editar
    </Button>
    <Button size="small" color="error" variant="outlined" onClick={onDelete}>
      Eliminar
    </Button>
  </Box>
);

interface TabBtnProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}

export const TabButton = ({ active, children, onClick }: TabBtnProps) => (
  <Button
    variant={active ? 'contained' : 'outlined'}
    size="small"
    onClick={onClick}
    color="primary"
  >
    {children}
  </Button>
);
