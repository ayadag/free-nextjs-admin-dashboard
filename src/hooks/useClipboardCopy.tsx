import { useCallback } from 'react';

const useClipboardCopy = () => {
    const copyToClipboard = useCallback((text: any) => {
        if(navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Text copied to clipboard');
            }).catch(err => {
                console.log('Failed to copy to clipboard')
            });
        } else {
            console.log('Clipboard API not available')
        }
    },[])
    return copyToClipboard
}

export default useClipboardCopy