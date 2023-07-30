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
      div.classList.add('alert', `alert-${options?.type || 'info'}}`)
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
        className='toast toast-top toast-end anim'
        ref={containerRef}
      />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  return useContext(ToastContext).toast;
}

export default ToastContainer