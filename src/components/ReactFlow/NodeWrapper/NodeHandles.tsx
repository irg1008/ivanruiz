import { Handle, Position } from 'reactflow'

export function Handles() {
  return (
    <>
      <Handle type='target' id='top' position={Position.Top} className='!size-2 !bg-teal-500' />
      <Handle type='target' id='left' position={Position.Left} className='!size-2 !bg-teal-500' />
      <Handle
        type='source'
        id='bottom'
        position={Position.Bottom}
        className='!size-2 !bg-teal-500'
      />
      <Handle type='source' id='right' position={Position.Right} className='!size-2 !bg-teal-500' />
    </>
  )
}
