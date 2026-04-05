import { useQuery } from '@tanstack/react-query'
import {
  getDayMetrics,
  getHourlySales,
  getOrdersByType,
  getStockAlerts,
  getTablesStatus,
  getTopDishes,
  getWaiterPerformance,
  getWeeklyComparison,
} from '../data/dashboard-service'

const STALE = 60_000

export const useDayMetrics = () =>
  useQuery({ queryKey: ['dashboard', 'metrics'], queryFn: getDayMetrics, staleTime: STALE, refetchInterval: STALE })

export const useOrdersByType = () =>
  useQuery({ queryKey: ['dashboard', 'orders-by-type'], queryFn: getOrdersByType, staleTime: STALE, refetchInterval: STALE })

export const useWaiterPerformance = () =>
  useQuery({ queryKey: ['dashboard', 'waiters'], queryFn: getWaiterPerformance, staleTime: STALE, refetchInterval: STALE })

export const useTopDishes = () =>
  useQuery({ queryKey: ['dashboard', 'top-dishes'], queryFn: getTopDishes, staleTime: STALE, refetchInterval: STALE })

export const useStockAlerts = () =>
  useQuery({ queryKey: ['dashboard', 'stock-alerts'], queryFn: getStockAlerts, staleTime: STALE, refetchInterval: STALE })

export const useTablesStatus = () =>
  useQuery({ queryKey: ['dashboard', 'tables'], queryFn: getTablesStatus, staleTime: 30_000, refetchInterval: 30_000 })

export const useHourlySales = () =>
  useQuery({ queryKey: ['dashboard', 'hourly'], queryFn: getHourlySales, staleTime: STALE, refetchInterval: STALE })

export const useWeeklyComparison = () =>
  useQuery({ queryKey: ['dashboard', 'weekly'], queryFn: getWeeklyComparison, staleTime: STALE, refetchInterval: STALE })
