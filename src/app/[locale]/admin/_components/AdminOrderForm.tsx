'use client';

import { useForm, Controller, SubmitHandler, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createOrder } from '../actions';
import { OrderSchema } from '../schema';
import { MoneyInput } from '@/shared/components/ui/MoneyInput';
import { OrderPreview } from './OrderPreview';
import { format } from 'date-fns';
import Select from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';
import { DatePicker } from '@/shared/components/ui/DatePicker';
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
    reset,
    watch
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

  const watchedValues = watch();

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
    <div className="w-full max-w-[1100px] mx-auto p-4 lg:p-8">
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

      <div className="flex flex-col lg:flex-row justify-center gap-8">
        {/* Left Column: Form */}
        <div className="w-full lg:w-[600px] flex-shrink-0">
          <form onSubmit={handleSubmit((data) => onSubmit(data as unknown as OrderFormValues))} className="space-y-6">
            {/* Section 1: Opening Info */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-border-default space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border-divider">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-h4 text-grey-900">개통 정보</h2>
              </div>
              <Controller
                control={control}
                name="openingDate"
                render={({ field }) => (
                  <DatePicker
                    label="개통일"
                    date={field.value ? new Date(`${field.value}T00:00:00`) : undefined}
                    setDate={(date) => field.onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                    error={!!errors.openingDate}
                    helperText={errors.openingDate?.message}
                  />
                )}
              />
            </div>

            {/* Section 2: Payment Info */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-border-default space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-border-divider">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-h4 text-grey-900">납부 정보</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  control={control}
                  name="deposit"
                  render={({ field }) => (
                    <MoneyInput
                      label="입금 (Deposit)"
                      placeholder="0"
                      inputMode="numeric"
                      value={field.value === 0 ? '' : field.value}
                      onValueChange={(values) => {
                        field.onChange(values.floatValue ?? 0);
                      }}
                      error={!!errors.deposit}
                      helperText={errors.deposit?.message}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="collection"
                  render={({ field }) => (
                    <MoneyInput
                      label="수납 (Collection)"
                      placeholder="0"
                      inputMode="numeric"
                      value={field.value === 0 ? '' : field.value}
                      onValueChange={(values) => {
                        field.onChange(values.floatValue ?? 0);
                      }}
                      error={!!errors.collection}
                      helperText={errors.collection?.message}
                    />
                  )}
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
                      options={[
                        '변경 없음',
                        '위버스 초이스 프리미엄',
                        '위버스 초이스 스페셜',
                        '위버스 초이스 베이직',
                        '가전구독 초이스 프리미엄',
                        '가전구독 초이스 스페셜',
                        '가전구독 초이스 베이직',
                        '폰케어 초이스 프리미엄',
                        '폰케어 초이스 스페셜',
                        '폰케어 초이스 베이직',
                        '티빙/지니/밀리 초이스 베이직',
                        '티빙/지니/밀리 초이스 스페셜',
                        '티빙/지니/밀리 초이스 프리미엄',
                        '(유튜브 프리미엄) 초이스 프리미엄',
                        '(유튜브 프리미엄) 초이스 스페셜',
                        '(유튜브 프리미엄) 초이스 베이직',
                        '5G 웰컴 3',
                        '5G 웰컴 5',
                        '5G 슬림 4GB(이월)',
                        '5G 슬림 7GB(이월)',
                        '5G 슬림 10GB(이월)',
                        '5G 슬림 14GB(이월)',
                        '5G 슬림 21GB(이월)',
                        '5G 심플 30GB',
                        '5G 슬림 4GB',
                        '5G 슬림 10GB',
                        '5G 슬림 21GB',
                        '5G 심플 50GB',
                        '5G 심플 70GB',
                        '5G 심플 90GB',
                        '5G 시니어 C형',
                        '5G 시니어 B형',
                        '5G 시니어 A형',
                        '5G 시니어 베이직',
                        '디바이스 초이스 베이직',
                        '디바이스 초이스 스페셜',
                        '디바이스 초이스 프리미엄',
                        '5G 세이브(군인)',
                        '5G 슬림 복지(군인)',
                        '5G Y슬림(군인)',
                        '5G 슬림(군인)',
                        '삼성 초이스 프리미엄',
                        '삼성 초이스 스페셜',
                        '삼성 초이스 베이직',
                        '5G 주니어 슬림',
                        '5G 주니어',
                        '디즈니+ 초이스 베이직',
                        '디즈니+ 초이스 스페셜',
                        '디즈니+ 초이스 프리미엄',
                        '5G 심플 복지',
                        '5G 베이직 복지',
                        '5G 슬림 복지',
                        '넷플릭스 초이스 베이직',
                        '넷플릭스 초이스 스페셜',
                        '넷플릭스 초이스 프리미엄',
                        '5G 심플 110GB',
                        '5G Y슬림',
                        'Y 베이직',
                        'Y 스페셜',
                        '5G Y틴',
                        '베이직',
                        '스페셜',
                        'Y주니어 ON',
                        'Y군인 55 PLUS',
                        'Y군인 77 PLUS',
                        '나눔 베이직',
                        '데이터 ON 나눔',
                        '시니어 베이직',
                        'Y군인 55 PLUS(미디어팩)',
                        'Y군인 33',
                        'Y틴 ON',
                        'Y데이터ON 비디오 플러스',
                        'Y데이터ON 프리미엄',
                        '데이터ON 프리미엄',
                        '데이터ON 비디오 플러스',
                        'LTE 베이직',
                        'LTE 음성 12.1',
                        'LTE 음성 18.7',
                        '순 망내무한선택형180분250MB',
                        '순 망내무한선택형100분1GB',
                        '순 망내무한선택형100분250MB',
                        '순 선택형180분1GB',
                        '순 선택형180분250MB',
                        '순 선택형100분2GB',
                        '순 선택형100분1GB',
                        '순 선택형100분250MB',
                        'Y주니어 19.8',
                        'Y틴 20',
                        'Y틴 27',
                        'LTE-골든150',
                        '순 골든20(LTE)',
                        '키즈 알115(LTE)'
                      ]}
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

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isPending}
            >
              {isPending ? '저장 중...' : '주문서 등록하기'}
            </Button>
          </form>
        </div>

        {/* Right Column: Preview */}
        <div className="hidden lg:block w-[300px] flex-shrink-0">
          <OrderPreview values={watchedValues} />
        </div>
      </div>
    </div>
  );
}
