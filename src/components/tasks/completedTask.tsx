import { removeTask, setCompleted, Task } from "@/TasksStore/Features/tasks/taskManager"
import { faCheck, faCircleExclamation, faClock, faEllipsis, faLocationDot, faReply, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from "@nextui-org/react"
import { Key } from "react"
import { useDispatch } from "react-redux"

export default function CompletedTask(props:{task:Task}) {
  const task = props.task
  const id = task.id
  const dispatch = useDispatch()

  function doTaskAction(actionName: string | Key) {
    switch (actionName) {
      case "setUncompleted":
        dispatch(setCompleted({id, status: !task.isCompleted }))
        break;
      case "deleteTask":
        dispatch(removeTask({id}))
        break;
    }
  }

  return <div className="break-all mb-4 ~px-3/6 py-2 min-h-20 rounded-2xl border-4 border-green-500 bg-elementBg flex items-center ~gap-2/4 w-[95%] lg:w-[70%] shadow-md shadow-green-400">
    <div className="flex flex-col gap-3">
      {/* Completed mark */}
      <div className='~text-2xl/4xl text-success'><FontAwesomeIcon icon={faCheck} /></div>
      {/* Priority Mark */}
      {task.isHighPriority 
      ? <Tooltip content="High priority" color='danger'>
          <FontAwesomeIcon className='~text-2xl/4xl text-danger' icon={faCircleExclamation} />
        </Tooltip>
      : null}
    </div>
    <div className='flex justify-between w-full items-center'>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-col'>
          <div className='~text-xl/2xl'>{task.title}</div>
          <div className='~text-sm/md-1'>{task.desc}</div>
        </div>
        <div className='~text-xs/sm text-gray-500 flex gap-2 font-medium'>
          {task.time ? <div className='flex gap-1 items-center'><FontAwesomeIcon icon={faClock} />{task.time}</div> : null}
          {task.location ? <div className='flex gap-1 items-center'><FontAwesomeIcon icon={faLocationDot} />{task.location}</div> : null}
        </div>
      </div> 
      <Dropdown>
            <Tooltip content="More options">
              <div>
                <DropdownTrigger>
                    <Button variant="solid" size="lg" isIconOnly className='text-white text-2xl'><FontAwesomeIcon icon={faEllipsis} /></Button>
                </DropdownTrigger>
              </div>
            </Tooltip>
          <DropdownMenu onAction={(key) => doTaskAction(key)} aria-label="Static Actions">
            <DropdownItem textValue="setUncompleted" key="setUncompleted" startContent={<FontAwesomeIcon icon={faReply}/>}>Set as Uncompleted</DropdownItem>
            <DropdownItem textValue="deleteTask" key="deleteTask" startContent={<FontAwesomeIcon icon={faTrash}/>} className="text-danger" color="danger">
              Delete task
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
    </div>
  </div>
}