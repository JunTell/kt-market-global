'use client';

import { useActionState } from 'react';
import { loginAdmin } from '../actions';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { Lock } from 'lucide-react';

const initialState = {
    success: false,
    message: '',
};

export function AdminLoginForm() {
    const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

    if (state?.success) {
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-bg-grouped">
            <div className="w-full max-w-[320px] bg-white rounded-2xl shadow-card p-8 border border-border-default">
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="h-12 w-12 bg-grey-50 rounded-full flex items-center justify-center mb-4">
                        <Lock className="h-5 w-5 text-grey-600" />
                    </div>
                    <h1 className="text-h4 text-grey-900 mb-1">관리자 접속</h1>
                    <p className="text-body2 text-grey-500">
                        비밀번호를 입력해주세요.
                    </p>
                </div>

                <form action={formAction} className="flex flex-col gap-4">
                    <div className="space-y-2">
                        <Input
                            name="password"
                            type="password"
                            placeholder="비밀번호"
                            maxLength={4}
                            pattern="\d*"
                            inputMode="numeric"
                            className="text-center h-12 text-lg tracking-[0.2em] font-bold"
                            autoFocus
                            required
                        />

                        {state?.message && !state.success && (
                            <p className="text-center text-caption font-medium text-status-error">
                                {state.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        size="md"
                        disabled={isPending}
                        fullWidth
                    >
                        {isPending ? '확인 중...' : '로그인'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-micro text-grey-400">
                    Authorized Personnel Only
                </div>
            </div>
        </div>
    );
}
