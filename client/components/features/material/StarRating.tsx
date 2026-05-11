import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';

interface Props {
  rating: number; // 0–5, supports .5
}

export default function StarRating({ rating }: Props) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        const Icon = filled ? StarIcon : half ? StarHalfIcon : StarBorderIcon;
        return (
          <Icon key={star} style={{ fontSize: '0.9rem', color: '#f59e0b' }} />
        );
      })}
    </div>
  );
}
