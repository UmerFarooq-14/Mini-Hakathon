import { Button } from "@/components/ui/button"
import Layout from '../components/layout/Layout'
import TaskList from '../components/taskList'
import { Input } from "@/components/ui/input"

const TaskListComp = () => {

    return (
        <div>
            <Layout>
                <TaskList showButton={false}/>
            </Layout>
        </div>
    )
}

export default TaskListComp
