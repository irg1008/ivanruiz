import { Handle, Position } from 'reactflow'

export function Handles() {
  return (
    <>
      <Handle type='target' id='top' position={Position.Top} className='!bg-teal-500' />
      <Handle type='target' id='left' position={Position.Left} className='!bg-teal-500' />
      <Handle type='source' id='bottom' position={Position.Bottom} className='!bg-teal-500' />
      <Handle type='source' id='right' position={Position.Right} className='!bg-teal-500' />
    </>
  )
}
