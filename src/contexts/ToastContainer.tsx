import { PropsWithChildren, createContext, useCallback, useContext, useRef } from 'react'

type ToastOptions = {
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

type ToastContextProps = {
  toast: (message: string, options?: ToastOptions) => void
}

const ToastContext = createContext<ToastContextProps>({
  toast: () => {},
})

function ToastContainer({children}: PropsWithChildren) {
  const containerRef = useRef<HTMLDivElement>(null);

  const toast = useCallback((message: string, options?: ToastOptions) => {
    if (document && containerRef.current) {
      const div = document.createElement('div')
      const alertClass = (
        options?.type === 'success' ? 'alert-success' :
        options?.type === 'error' ? 'alert-error' :
        options?.type === 'warning' ? 'alert-warning' :
        'alert-info'
      )
      div.classList.add('alert', alertClass, 'z-10')
      const id = `toast-${(Date.now())}`
      div.id = id
      const span = document.createElement('span')
      span.innerText = message
      div.appendChild(span)
      containerRef.current.appendChild(div)
      setTimeout(() => {
        if (div) {
          div.remove()
        }
      }, options?.duration || 3000)
    }
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        id="toast-container"
        className='toast toast-bottom toast-end'
        ref={containerRef}
      />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  return useContext(ToastContext).toast;
}

export default ToastContainer