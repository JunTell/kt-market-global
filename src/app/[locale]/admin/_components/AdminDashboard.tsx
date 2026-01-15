'use client';

import { logoutAdmin } from '../actions';
import { Button } from '@/shared/components/ui/Button';
import Link from 'next/link';
import { LogOut, ShieldCheck, BarChart3, Users, Settings, FileText } from 'lucide-react';

export function AdminDashboard() {
    return (
        <div className="min-h-screen bg-bg-grouped w-full">
            {/* Header */}
            <header className="bg-white border-b border-border-default sticky top-0 z-50">
                <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h1 className="text-h4 text-grey-900">관리자 대시보드</h1>
                            <p className="text-micro text-grey-500">Global Operations</p>
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        size="md"
                        onClick={() => logoutAdmin()}
                        className="!h-10 text-sm gap-2"
                    >
                        <LogOut size={16} />
                        <span>로그아웃</span>
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8">

                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-h2 mb-2">대시보드</h2>
                    <p className="text-body1 text-grey-600">
                        관리자 페이지에 오신 것을 환영합니다.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: '활성 사용자', value: '1,234', icon: Users, color: 'bg-blue-50 text-blue-600' },
                        { label: '총 매출', value: '₩45.2m', icon: BarChart3, color: 'bg-green-50 text-green-600' },
                        { label: '시스템 상태', value: '정상', icon: Settings, color: 'bg-purple-50 text-purple-600' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-card border border-border-default flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <div className="text-caption text-grey-500 font-medium">{stat.label}</div>
                                <div className="text-h3 text-grey-900">{stat.value}</div>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-h4 text-grey-800 mb-4">빠른 작업</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            href="/admin/orders/create"
                            className="bg-white p-6 rounded-2xl shadow-card border border-border-default hover:border-primary transition-colors flex flex-col gap-2 group"
                        >
                            <div className="h-10 w-10 rounded-lg bg-primary-bg text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                <FileText size={20} />
                            </div>
                            <span className="text-body1 font-bold text-grey-900">주문서 작성</span>
                            <span className="text-caption text-grey-500">새로운 개통 신청서를 작성합니다.</span>
                        </Link>
                    </div>
                </div>

                {/* Placeholder Content Area */}
                <div className="bg-white rounded-2xl shadow-card border border-border-default p-8 min-h-[400px] flex flex-col items-center justify-center text-center">
                    <div className="bg-bg-grouped h-32 w-32 rounded-full mb-6 animate-pulse" />
                    <h3 className="text-h4 text-grey-800 mb-2">데이터가 없습니다</h3>
                    <p className="text-body2 text-grey-500 max-w-sm">
                        현재 표시할 관리자 기능이 없습니다. 추후 기능이 추가될 예정입니다.
                    </p>
                </div>
            </main>
        </div>
    );
}
