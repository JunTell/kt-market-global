import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { OrderSchema } from '../schema';
import { z } from 'zod';

type OrderFormValues = z.infer<typeof OrderSchema>;

interface OrderPreviewProps {
  values: Partial<OrderFormValues>;
}

export function OrderPreview({ values }: OrderPreviewProps) {
  const formatCurrency = (value: number | undefined) => {
    if (!value) return '0원';
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    try {
      // Parse as local time yyyy-mm-dd
      return format(new Date(`${dateString}T00:00:00`), 'PPP', { locale: ko });
    } catch {
      return '-';
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-border-default sticky top-6 space-y-6">
      <h3 className="text-h4 text-grey-900 pb-4 border-b border-border-divider">
        작성 내용 미리보기
      </h3>

      <div className="space-y-6">
        {/* Opening Info */}
        <div className="space-y-2">
          <p className="text-caption text-grey-500 font-bold">개통일</p>
          <p className="text-body1 text-grey-900 font-medium">
            {formatDate(values.openingDate)}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-caption text-grey-500 font-bold">발송일</p>
          <p className="text-body1 text-grey-900 font-medium">
            {formatDate(values.shippingDate)}
          </p>
        </div>

        {/* Payment Info */}
        <div className="space-y-2">
          <p className="text-caption text-grey-500 font-bold">납부 정보</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-grey-500 block">입금</span>
              <span className="text-body2 text-primary font-bold">{formatCurrency(values.deposit)}</span>
              <span className="text-xs text-grey-400 block mt-1">{formatDate(values.depositDate)}</span>
            </div>
            <div>
              <span className="text-xs text-grey-500 block">수납</span>
              <span className="text-body2 text-primary font-bold">{formatCurrency(values.collection)}</span>
            </div>
          </div>
        </div>

        {/* Plan & Products */}
        <div className="space-y-2">
          <p className="text-caption text-grey-500 font-bold">상품 및 변경</p>
          <ul className="space-y-2 text-body2 text-grey-700">
            <li className="flex justify-between">
              <span className="text-grey-500">기본 요금제</span>
              <span className="font-medium text-right text-grey-900">{values.basePlan || '-'}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-grey-500">변경 요금제</span>
              <span className="font-medium text-right text-grey-900">{values.changedPlan || '-'}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-grey-500">결합</span>
              <span className="font-medium text-right text-grey-900">{values.combination || '-'}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-grey-500">악세사리</span>
              <span className="font-medium text-right text-grey-900">{values.accessories || '-'}</span>
            </li>
            {values.termination && (
              <li className="pt-2 border-t border-dashed border-border-divider">
                <span className="text-status-error font-bold block text-center">해지 신청 포함</span>
              </li>
            )}
          </ul>
        </div>

        {/* Memo */}
        {values.memo && (
          <div className="space-y-2 pt-4 border-t border-border-divider">
            <p className="text-caption text-grey-500 font-bold">메모</p>
            <p className="text-body2 text-grey-700 bg-bg-grouped p-3 rounded-lg whitespace-pre-wrap break-words">
              {values.memo}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
