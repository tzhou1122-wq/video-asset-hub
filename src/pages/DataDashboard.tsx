import React, { useMemo, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { TrendingUp, Clock, CheckCircle2, MoreHorizontal, Database, Gauge, Users, ArrowDown, Video, Upload, Loader2 } from 'lucide-react';
import { useAppStore } from '../store';
import { format } from 'date-fns';

export const DataDashboard: React.FC = () => {
  const { assets, fetchAssets, isLoading } = useAppStore();

  // 初始化加载素材
  useEffect(() => {
    if (assets.length === 0) {
      fetchAssets();
    }
  }, [assets.length, fetchAssets]);

  const stats = useMemo(() => {
    const total = assets.length;
    const pending = assets.filter(a => a.status === 'pending').length;
    const approved = assets.filter(a => a.status === 'approved').length;
    const rejected = assets.filter(a => a.status === 'rejected').length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayUploads = assets.filter(a => new Date(a.uploadTime) >= today).length;

    // City distribution
    const cityMap: Record<string, { count: number, totalSize: number }> = {};
    assets.forEach(a => {
      if (!cityMap[a.city]) cityMap[a.city] = { count: 0, totalSize: 0 };
      cityMap[a.city].count++;
      cityMap[a.city].totalSize += a.fileSize;
    });

    const cities = Object.keys(cityMap);
    const cityCounts = cities.map(c => cityMap[c].count);
    const cityAvgSizes = cities.map(c => (cityMap[c].totalSize / cityMap[c].count / (1024 * 1024 * 1024)).toFixed(2));

    // Trend (Last 7 days)
    const trendData: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = format(d, 'MM-dd');
      trendData[dateStr] = 0;
    }

    assets.forEach(a => {
      const dateStr = format(new Date(a.uploadTime), 'MM-dd');
      if (trendData[dateStr] !== undefined) {
        trendData[dateStr]++;
      }
    });

    const trendLabels = Object.keys(trendData);
    const trendValues = Object.values(trendData);

    // Total storage
    const totalSizeGB = assets.reduce((acc, a) => acc + a.fileSize, 0) / (1024 * 1024 * 1024);

    return {
      total,
      pending,
      approved,
      rejected,
      todayUploads,
      cities,
      cityCounts,
      cityAvgSizes,
      trendLabels,
      trendValues,
      totalSizeGB
    };
  }, [assets]);

  const statusOption = {
    tooltip: { trigger: 'item' },
    series: [
      {
        name: '审核状态',
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        label: { show: false, position: 'center' },
        emphasis: {
          label: { show: false }
        },
        labelLine: { show: false },
        data: [
          { value: stats.approved, name: '已通过', itemStyle: { color: '#3b82f6' } },
          { value: stats.pending, name: '待审核', itemStyle: { color: '#f59e0b' } },
          { value: stats.rejected, name: '已驳回', itemStyle: { color: '#ef4444' } }
        ]
      }
    ]
  };

  const cityOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', crossStyle: { color: '#999' } }
    },
    legend: { data: ['素材数量', '平均大小(GB)'], bottom: 0 },
    xAxis: [
      {
        type: 'category',
        data: stats.cities,
        axisPointer: { type: 'shadow' },
        axisLine: { show: false },
        axisTick: { show: false }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '数量',
        min: 0,
        axisLabel: { formatter: '{value}' },
        splitLine: { lineStyle: { type: 'dashed', color: '#e8e8e8' } }
      },
      {
        type: 'value',
        name: 'GB',
        min: 0,
        axisLabel: { formatter: '{value}' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '素材数量',
        type: 'bar',
        barWidth: '40%',
        itemStyle: { color: '#60a5fa', borderRadius: [4, 4, 0, 0] },
        emphasis: { itemStyle: { color: '#3b82f6' } },
        data: stats.cityCounts
      },
      {
        name: '平均大小(GB)',
        type: 'line',
        yAxisIndex: 1,
        itemStyle: { color: '#f59e0b' },
        symbolSize: 8,
        data: stats.cityAvgSizes
      }
    ]
  };

  const trendOption = {
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: stats.trendLabels,
      axisLine: { show: false },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#e8e8e8' } }
    },
    series: [
      {
        name: '上传量',
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 3, color: '#3b82f6' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.2)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0)' }
            ]
          }
        },
        data: stats.trendValues
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section>
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface mb-1">全局数据洞察</h1>
          <p className="text-on-surface-variant text-sm">实时素材分布与运营效率指标。</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:bg-primary-fixed/30 transition-colors duration-300">
            <div>
              <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">素材总量</p>
              <h3 className="text-2xl font-bold text-on-surface">{stats.total.toLocaleString()}</h3>
              <p className="text-xs text-primary font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> 较上月 +14%
              </p>
            </div>
            <div className="h-12 w-12 bg-primary-fixed flex items-center justify-center rounded-lg text-primary">
              <Video className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:bg-tertiary-fixed/30 transition-colors duration-300">
            <div>
              <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">待审核素材</p>
              <h3 className="text-2xl font-bold text-on-surface">{stats.pending}</h3>
              <p className="text-xs text-tertiary font-medium mt-1 flex items-center gap-1">
                <Clock className="w-4 h-4" /> 优先级队列: {Math.floor(stats.pending * 0.2)}
              </p>
            </div>
            <div className="h-12 w-12 bg-tertiary-fixed flex items-center justify-center rounded-lg text-tertiary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:bg-secondary-fixed/30 transition-colors duration-300">
            <div>
              <p className="text-xs font-semibold text-outline uppercase tracking-wider mb-2">今日新增上传</p>
              <h3 className="text-2xl font-bold text-on-surface">{stats.todayUploads}</h3>
              <p className="text-xs text-secondary font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 通过率 {Math.round((stats.approved / (stats.approved + stats.rejected)) * 100)}%
              </p>
            </div>
            <div className="h-12 w-12 bg-secondary-fixed flex items-center justify-center rounded-lg text-secondary">
              <Upload className="w-6 h-6" />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-6">
        {isLoading && (
          <div className="col-span-12 flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm font-bold text-on-surface animate-pulse">正在同步全球素材库...</p>
            </div>
          </div>
        )}
        {!isLoading && (
          <>
            <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold text-on-surface">审核状态分布</h4>
            <MoreHorizontal className="text-outline cursor-pointer hover:text-on-surface" />
          </div>
          <div className="relative h-64">
            <ReactECharts option={statusOption} style={{ height: '100%', width: '100%' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-on-surface">{Math.round((stats.approved / stats.total) * 100)}%</span>
              <span className="text-[10px] text-outline uppercase tracking-tighter">健康</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-on-surface-variant">已通过</span>
              </div>
              <span className="font-bold">{Math.round((stats.approved / stats.total) * 100)}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-on-surface-variant">待审核</span>
              </div>
              <span className="font-bold">{Math.round((stats.pending / stats.total) * 100)}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="text-on-surface-variant">已驳回</span>
              </div>
              <span className="font-bold">{Math.round((stats.rejected / stats.total) * 100)}%</span>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="font-bold text-on-surface">区域素材密度</h4>
              <p className="text-xs text-on-surface-variant">素材数量 vs 平均文件大小 (GB)</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs bg-surface-container rounded border-none text-outline hover:text-on-surface transition-colors">导出</button>
              <button className="px-3 py-1 text-xs bg-primary text-white rounded border-none hover:opacity-90 transition-all">筛选</button>
            </div>
          </div>
          <div className="h-72 w-full">
            <ReactECharts option={cityOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        <div className="col-span-12 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h4 className="text-lg font-bold text-on-surface">素材上传趋势 (近7天)</h4>
              <p className="text-sm text-on-surface-variant">系统过去 7 个工作日的活跃度</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-8 h-1 bg-primary-container rounded-full"></span>
                <span className="text-xs font-semibold text-outline">当前周期</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-1 bg-surface-container-highest rounded-full"></span>
                <span className="text-xs font-semibold text-outline">历史平均</span>
              </div>
            </div>
          </div>
          <div className="h-64 w-full">
            <ReactECharts option={trendOption} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>

        <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-surface-container-high/40 p-5 rounded-xl border-none">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-primary w-5 h-5" />
              <span className="text-xs font-bold text-on-surface uppercase tracking-widest">存储容量</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-on-surface-variant">已用容量</span>
                <span className="font-bold">{Math.round((stats.totalSizeGB / 100) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                <div className="w-[78%] h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (stats.totalSizeGB / 100) * 100)}%` }}></div>
              </div>
              <p className="text-[10px] text-outline mt-2">100 GB 中已使用 {stats.totalSizeGB.toFixed(1)} GB</p>
            </div>
          </div>
          <div className="bg-surface-container-high/40 p-5 rounded-xl border-none">
            <div className="flex items-center gap-3 mb-4">
              <Gauge className="text-tertiary w-5 h-5" />
              <span className="text-xs font-bold text-on-surface uppercase tracking-widest">处理效率</span>
            </div>
            <h4 className="text-2xl font-bold mb-1">94.2s</h4>
            <p className="text-[10px] text-outline">平均处理时长</p>
            <div className="mt-2 text-[10px] text-green-600 font-bold flex items-center gap-1">
              <ArrowDown className="w-3 h-3" /> 更快 12%
            </div>
          </div>
          <div className="bg-surface-container-high/40 p-5 rounded-xl border-none">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-secondary w-5 h-5" />
              <span className="text-xs font-bold text-on-surface uppercase tracking-widest">活跃用户</span>
            </div>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-blue-100 flex items-center justify-center text-xs">U1</div>
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-green-100 flex items-center justify-center text-xs">U2</div>
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-purple-100 flex items-center justify-center text-xs">U3</div>
              <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container flex items-center justify-center text-[10px] font-bold">+12</div>
            </div>
            <p className="text-[10px] text-outline mt-3 font-medium">当前在线</p>
          </div>
          <div className="bg-primary p-5 rounded-xl shadow-lg flex flex-col justify-between">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">系统运行状况</p>
            <div>
              <p className="text-white text-xl font-bold">运行稳定</p>
              <div className="flex items-center gap-1 text-white/80 text-[10px] mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                所有节点运行正常
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
</div>
);
};
