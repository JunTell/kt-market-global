'use client';

import { useForm, Controller, SubmitHandler, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrder } from '../actions';
import { OrderSchema } from '../schema';
import { Input } from '@/shared/components/ui/Input';
import Select from '@/shared/components/ui/Select';
import { Button, BottomCTA } from '@/shared/components/ui/Button';
import { useState, useTransition } from 'react';
import { Calendar, CreditCard, Smartphone, FileText, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';

type OrderFormValues = z.infer<typeof OrderSchema>;

export function AdminOrderForm() {
  const [isPending, startTransition] = useTransition();
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<OrderFormValues>({
    resolver: zodResolver(OrderSchema) as Resolver<OrderFormValues>,
    defaultValues: {
      openingDate: new Date().toISOString().split('T')[0],
      deposit: 0,
      collection: 0,
      termination: false,
      accessories: '',
      planChange: '',
      combination: '',
      memo: '',
    },
  });

  const onSubmit = (data: OrderFormValues) => {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      const result = await createOrder({ success: false, message: '' }, formData);
      setSubmitResult(result);
      if (result.success) {
        reset();
      }
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-6 pb-32">
      <header className="mb-6">
        <h1 className="text-h2 text-grey-900 mb-1">주문서 작성</h1>
        <p className="text-body2 text-grey-600">고객의 개통 정보를 입력해주세요.</p>
      </header>

      {submitResult && (
        <div className={`p-4 rounded-xl flex items-center gap-3 ${submitResult.success ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-status-error'}`}>
          {submitResult.success && <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <p className="font-medium text-body2">{submitResult.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit((data) => onSubmit(data as unknown as OrderFormValues))} className="space-y-6">
        {/* Section 1: Opening Info */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-border-default space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border-divider">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="text-h4 text-grey-900">개통 정보</h2>
          </div>
          <Input
            label="개통일"
            type="date"
            {...register('openingDate')}
            error={!!errors.openingDate}
            helperText={errors.openingDate?.message}
          />
        </div>

        {/* Section 2: Payment Info */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-border-default space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border-divider">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-h4 text-grey-900">납부 정보</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="입금 (Deposit)"
              type="number"
              placeholder="0"
              inputMode="numeric"
              {...register('deposit')}
              error={!!errors.deposit}
              helperText={errors.deposit?.message}
            />
            <Input
              label="수납 (Collection)"
              type="number"
              placeholder="0"
              inputMode="numeric"
              {...register('collection')}
              error={!!errors.collection}
              helperText={errors.collection?.message}
            />
          </div>
        </div>

        {/* Section 3: Product & Changes */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-border-default space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border-divider">
            <Smartphone className="w-5 h-5 text-primary" />
            <h2 className="text-h4 text-grey-900">상품 및 변경</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              control={control}
              name="planChange"
              render={({ field }) => (
                <Select
                  label="요금제 변경"
                  options={['변경 없음', '5G 베이직', '5G 스페셜', 'LTE 베이직']}
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="선택해주세요"
                />
              )}
            />
            <Controller
              control={control}
              name="combination"
              render={({ field }) => (
                <Select
                  label="결합"
                  options={['결합 없음', '프리미엄 가족 결합', '싱글 결합']}
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="선택해주세요"
                />
              )}
            />
          </div>

          <Controller
            control={control}
            name="accessories"
            render={({ field }) => (
              <Select
                label="악세사리"
                options={['선택 안함', '케이스', '필름', '충전기', '케이스+필름']}
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="선택해주세요"
              />
            )}
          />

          <label className="flex items-center gap-3 p-4 bg-bg-grouped rounded-xl cursor-pointer hover:bg-bg-pressed transition-colors">
            <input
              type="checkbox"
              {...register('termination')}
              className="w-5 h-5 text-primary rounded border-border-strong focus:ring-primary"
            />
            <span className="text-body1 text-grey-900 font-medium select-none">
              해지 (Termination)
            </span>
          </label>
        </div>

        {/* Section 4: Memo */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-border-default space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border-divider">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="text-h4 text-grey-900">메모</h2>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-body2 font-bold text-grey-800">
              상세 메모
            </label>
            <textarea
              {...register('memo')}
              rows={4}
              className="w-full p-4 rounded-xl bg-bg-input border border-border-strong focus:border-border-focus focus:ring-1 focus:ring-border-focus outline-none transition-all resize-none text-body1 text-grey-900 placeholder:text-grey-400"
              placeholder="특이사항을 입력해주세요."
            />
            {errors.memo && (
              <span className="text-caption text-status-error">{errors.memo.message}</span>
            )}
          </div>
        </div>

        <BottomCTA>
          <Button
            type="submit"
            fullWidth
            size="lg"
            disabled={isPending}
          >
            {isPending ? '저장 중...' : '주문서 등록하기'}
          </Button>
        </BottomCTA>
      </form>
    </div>
  );
}
