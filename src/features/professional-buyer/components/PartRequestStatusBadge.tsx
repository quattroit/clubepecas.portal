import { Badge } from "@/components/ui/badge";
import { PartRequestStatus } from "@/contracts/common/enums";
import {
  getPartRequestStatusBadgeVariant,
  getPartRequestStatusLabel,
} from "@/features/professional-buyer/utils/partRequestStatus";

type PartRequestStatusBadgeProps = {
  status: PartRequestStatus;
  label?: string;
};

function PartRequestStatusBadge({ status, label }: PartRequestStatusBadgeProps) {
  return (
    <Badge variant={getPartRequestStatusBadgeVariant(status)}>
      {label ?? getPartRequestStatusLabel(status)}
    </Badge>
  );
}

export { PartRequestStatusBadge };
