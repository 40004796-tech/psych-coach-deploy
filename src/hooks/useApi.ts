"use client";
import { useState, useCallback } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (...args: any[]): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction(...args);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "操作失败";
      setState({ data: null, loading: false, error: errorMessage });
      return null;
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset
  };
}

// 专门用于表单提交的hook
export function useFormSubmit<T = any>(
  submitFunction: (data: T) => Promise<any>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (data: T) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setError(null);

    try {
      const result = await submitFunction(data);
      setSubmitStatus("success");
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "提交失败";
      setError(errorMessage);
      setSubmitStatus("error");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [submitFunction]);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setSubmitStatus("idle");
    setError(null);
  }, []);

  return {
    isSubmitting,
    submitStatus,
    error,
    submit,
    reset
  };
}

