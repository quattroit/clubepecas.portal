import { Badge } from "@/components/ui/badge";
import { QuotationStatus } from "@/contracts/common/enums";
import {
  getQuotationStatusBadgeVariant,
  getQuotationStatusLabel,
} from "@/features/professional-buyer/utils/quotationStatus";

type QuotationStatusBadgeProps = {
  status: QuotationStatus;
};

function QuotationStatusBadge({ status }: QuotationStatusBadgeProps) {
  return (
    <Badge variant={getQuotationStatusBadgeVariant(status)}>
      {getQuotationStatusLabel(status)}
    </Badge>
  );
}

export { QuotationStatusBadge };
