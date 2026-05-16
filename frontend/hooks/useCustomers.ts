"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { customerApi, Customer, StatsData } from "@/services/api";

export function useCustomers(initialSearch = "") {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCustomers = useCallback(async (q = search, page = 1) => {
    setLoading(true);
    try {
      const res = await customerApi.getAll(q, page, 50);
      setCustomers(res.data);
      if (res.pagination) setPagination(res.pagination);
    } catch {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchCustomers(search, 1), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, fetchCustomers]);

  const refresh = useCallback(() => fetchCustomers(search, pagination.page), [fetchCustomers, search, pagination.page]);

  return { customers, loading, search, setSearch, pagination, refresh };
}

export function useStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await customerApi.getStats();
      setStats(res.data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, refresh: fetchStats };
}

export function usePhoneCheck() {
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<{
    exists: boolean;
    customer?: Customer;
  } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkPhone = useCallback((phone: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setResult(null);

    const cleaned = phone.replace(/\s+/g, "");
    if (cleaned.length < 7) return;

    debounceRef.current = setTimeout(async () => {
      setChecking(true);
      try {
        const res = await customerApi.checkByPhone(cleaned);
        setResult({
          exists: res.exists,
          customer: res.data,
        });
      } catch {
        setResult(null);
      } finally {
        setChecking(false);
      }
    }, 500);
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  return { checking, result, checkPhone, reset };
}
