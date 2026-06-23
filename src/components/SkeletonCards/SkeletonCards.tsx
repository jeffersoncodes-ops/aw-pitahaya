import { Skeleton, Grid } from '@mui/material';

interface SkeletonCardsProps {
  count?: number;
  height?: number;
}

function SkeletonCards({ count = 3, height }: SkeletonCardsProps) {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
          <Skeleton
            variant="rounded"
            height={height ?? 200}
            sx={{ width: '100%' }}
            data-testid="skeleton-card"
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default SkeletonCards;
