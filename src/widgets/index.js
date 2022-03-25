import FormGroupInput from './forms/formGroupInput'
import FormGroupSelect from './forms/formGroupSelect'
import FormGroupTextarea from './forms/formGroupTextarea'

import DropDown from './pickers/Dropdown'
import PaperTable from './dataviewers/PaperTable'
import Button from './buttons/Button'

import Panel from './cards/Panel'
import Card from './cards/Card'
import StatsCard from './cards/StatsCard'

import SidebarPlugin from './layouts/SidebarPlugin/index'
import ActionPanel from './layouts/ActionPanel'

let widgets = {
  ActionPanel,
  FormGroupInput,
  FormGroupSelect,
  FormGroupTextarea,
  Panel,
  Card,
  StatsCard,
  PaperTable,
  DropDown,
  SidebarPlugin
}

export default widgets

export {
  ActionPanel,
  FormGroupInput,
  FormGroupSelect,
  FormGroupTextarea,
  Panel,
  Card,
  StatsCard,
  PaperTable,
  DropDown,
  Button,
  SidebarPlugin
}
