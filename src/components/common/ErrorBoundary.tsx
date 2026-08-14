'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { logger } from '@/lib/logger'
import ErrorState from '@/components/ui/ErrorState'

interface Props {
  children: ReactNode
  fallbackTitle?: string
  fallbackMessage?: string
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Client Component ErrorBoundary caught:', { error, errorInfo })
  }

  public handleRetry = () => {
    this.setState({ hasError: false })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4">
          <ErrorState
            title={this.props.fallbackTitle || 'تعذر عرض هذا الجزء'}
            message={
              this.props.fallbackMessage ||
              'واجه المكون خطأ غير متوقع أثناء معالجة البيانات.'
            }
            onRetry={this.handleRetry}
          />
        </div>
      )
    }

    return this.props.children
  }
}