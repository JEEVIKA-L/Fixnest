import { useEffect, useCallback, RefObject } from 'react';

export const useOutsideClick = (
 ref: RefObject<HTMLElement | null>,
 callback: () => void,
 active: boolean = true
) => {
 const handleClick = useCallback(
 (e: MouseEvent) => {
 if (ref.current && !ref.current.contains(e.target as Node)) {
 callback();
 }
 },
 [ref, callback]
 );

 useEffect(() => {
 if (active) {
 document.addEventListener('mousedown', handleClick);
 } else {
 document.removeEventListener('mousedown', handleClick);
 }

 return () => {
 document.removeEventListener('mousedown', handleClick);
 };
 }, [active, handleClick]);
};
