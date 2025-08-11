import { Button } from "@/components/ui/button"
import Layout from '../components/layout/Layout'
import AddTask from "../components/addTask"
import TaskList from "../components/taskList"

const MainPage = () => {
  return (
    <div>
      <Layout>
        <div className="flex justify-end m-3"> 
        <AddTask />
        </div>
        <div> 

        <TaskList />
        </div>
      </Layout>
    </div>
  )
}

export default MainPage
