import React from 'react';

interface MemberAvatarProps {
 name: string;
 src?: string;
 size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const MemberAvatar = ({ name, src, size = 'md' }: MemberAvatarProps) => {
 const sizeClasses = {
 xs: 'w-5 h-5 text-[8px]',
 sm: 'w-8 h-8 text-xs',
 md: 'w-10 h-10 text-sm',
 lg: 'w-12 h-12 text-base',
 };

 if (src) {
 return (
 <div className={`${sizeClasses[size || 'md']} rounded-full overflow-hidden border-2 border-white ring-1 ring-gray-100 flex-shrink-0`}>
 <img src={src} alt={name} className="w-full h-full object-cover" />
 </div>
 );
 }

 const initials = name
 .split(' ')
 .map((n) => n[0])
 .join('')
 .toUpperCase();

 return (
 <div 
 className={`${sizeClasses[size || 'md']} rounded-full bg-gradient-to-br from-[#6A3DE8] to-[#7C3AED] flex items-center justify-center text-white font-bold border-2 border-white ring-1 ring-gray-100 flex-shrink-0`}
 title={name}
 >
 {initials}
 </div>
 );
};
