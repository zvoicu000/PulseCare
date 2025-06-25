import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'


interface StatCardProps{
    type:'appointments' | 'pending' | 'cancelled'
    count: number
    label:string
    icon:string
}

const StatCard = ({count = 0, label,icon,type}:StatCardProps) => {
  return (
    <div className={clsx('stat-card',{
        'bg-appointments' : type === 'appointments',
        'bg-pending' : type === 'pending',
        'bg-cancelled' : type === 'cancelled'
    })}>
        <div className='flex items-center gap-4'>
            <Image
                src={icon}
                height={32}
                width={32}
                alt='label'
                className='size-8 2-fit'
            />
        </div>
    </div>
  )
}

export default StatCard