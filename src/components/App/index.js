import React from 'react';
/* import logo from './logo.svg'; */
import './index.css';
import Main from '../Main';
import faker from 'faker';

class App extends React.Component {
  constructor(props) {
    super(props);
    faker.locale = 'es';
    //INITIALIZE STATE
    const employees = Array.from({ length: 30 }, () => ({
      name: faker.name.findName(),
      sector: faker.name.jobArea(),
      avatar: faker.image.avatar(),
      id: faker.random.uuid(),
    }))

    const sectors = employees.map(({ sector }) => sector);
    const sectorsUnrepeated = new Set(sectors);
    const sectorsArray = [...sectorsUnrepeated];
    this.state = {
      employees: employees,
      listBackup: employees,
      employeeOTM: null,
      employeeName: '',
      sectors: sectorsArray,
      selectedSector: '',
      optionState: true,
      employeeToEdit: {},
      employeeToEditName: '',
      modalActive: false
    };
    this.handleEmployeeOTM = this.handleEmployeeOTM.bind(this);
    this.handleAddEmployeeChange = this.handleAddEmployeeChange.bind(this);
    this.handleAddEmployeeSubmit = this.handleAddEmployeeSubmit.bind(this);
    this.handleDeleteEmployee = this.handleDeleteEmployee.bind(this);
    this.handleEditEmployee = this.handleEditEmployee.bind(this);
  }

  handleEmployeeOTM(employeeId) {
    this.setState({
      employeeOTM: employeeId
    });
    setTimeout(() => {
    }, 1);

  }

  handleAddEmployeeChange = event => {
    //Destructure value from input
    const { value } = event.target;
    this.setState({ employeeName: value });
  }

  handleAddEmployeeSubmit = event => {
    event.preventDefault();
    //destructure employees and employeeName from state
    const { employees, employeeName } = this.state;

    const newEmployee = {
      name: employeeName,
      sector: faker.name.jobArea(),
      avatar: faker.image.avatar(),
      id: faker.random.uuid()
    }

    //new employeelist copying the current list and the added employee
    const newList = [newEmployee, ...employees];
    //set to state
    this.setState({
      employees: newList,
      listBackup: newList
    });
  }

  handleDeleteEmployee(id) {
    const { employees } = this.state;
    const newListWithoutDeleted = employees.filter(employee => employee.id !== id);
    this.setState({ employees: newListWithoutDeleted });
  }

  handleSelectSector = sector => {
    const { listBackup } = this.state;
    const listFilteredBySector = listBackup.filter(employee => employee.sector === sector);
    this.setState({
      selectedSector: sector,
      employees: listFilteredBySector,
      optionState: false
    });
  }

  handleRemoveSelectedSector = () => {
    this.setState(prevState => ({
      employees: prevState.listBackup,
      selectedSector: '',
      optionState: true
    }));
  }

  handleEditEmployee = id => {
    const { employees } = this.state;
    const selectedEmployee = employees.find(employee => employee.id === id);
    this.setState({ employeeToEdit: selectedEmployee });
    this.setState({
      modalActive: true,
      employeeToEditName: selectedEmployee.name
    });
  }

  handleModalClose = () => {
    this.setState({ modalActive: false });
  }

  handleEmployeeEdit = (event) => {
    event.preventDefault();
    const { employeeToEdit, employees } = this.state;
    const listWithoutEmployee = employees.filter(employee => employee.id !== employeeToEdit.id);
    this.setState({
      employees: [employeeToEdit, ...listWithoutEmployee],
      listBackup: [employeeToEdit, ...listWithoutEmployee],
      modalActive: false
    })
  }

  handleEditEmployeeName = (event) => {
    const { value } = event.target;
    this.setState(prevState => ({
      employeeToEditName: value,
      employeeToEdit: {
        ...prevState.employeeToEdit,
        name: value
      }
    })
    );
  }

  componentDidMount() {
    //FETCH DE DATA
  }

  render() {
    const {
      sectors,
      selectedSector,
      modalActive,
      employeeToEdit
    } = this.state;

    //MOSTRAR DATA EN HTML (SOLO JSX)
    //IT EXECUTES AT THE START AND EVERY TIME THE STATE CHANGES
    return <div className="App">

      <Dropdown
        sectors={sectors}
        selectedSector={selectedSector}
        onSelectSector={this.handleSelectSector}
        onRemoveSelectedSector={this.handleRemoveSelectedSector}
        optionState={this.state.optionState}>

      </Dropdown>
      {modalActive && (
        <div className='modal is-active'>
          <div className='modal-background' />
          <div className='modal-card'>
            <header className='modal-card-head'>
              <p className='modal-card-title'>Modal title</p>
              <button className='delete' aria-label='close'
                onClick={this.handleModalClose}
              />
            </header>
            <section className='modal-card-body'>
              <form className='form-add-employee'
                onSubmit={this.handleEmployeeEdit}
              >
                <input
                  className='input'
                  type='text'
                  value={this.state.employeeToEditName}
                  onChange={this.handleEditEmployeeName}
                />
                <button className='button is-success' type='submit'>
                  Actualizar
                </button>
              </form>
            </section>
          </div>
        </div>
      )}

      <Main
        employeeData={this.state.employees}
        handleAddEmployeeChange={this.handleAddEmployeeChange}
        handleAddEmployeeSubmit={this.handleAddEmployeeSubmit}
        handleDeleteEmployee={this.handleDeleteEmployee}
        handleEmployeeOTM={this.handleEmployeeOTM}
        employeeOTM={this.state.employeeOTM}
        handleEditEmployee={this.handleEditEmployee}
      />
    </div>
  }
}

const Dropdown = props => {
  const {
    sectors,
    selectedSector,
    onSelectSector,
    onRemoveSelectedSector,
    optionState
  } = props;
  return (
    <div className='App-Dropdown'>
      <h2>Filtrar por sector</h2>
      <div className='filter'>
        <select name='sectors' onChange={event => onSelectSector(event.target.value)}>
          <option selected={optionState} disabled>Elegí un sector</option>
          {
            sectors.map((sector) =>
              <option
                key={sector}
                value={sector}
              >
                {sector}

              </option>
            )
          }
        </select>

        {
          selectedSector && (
            <button
              className='button'
              aria-haspopup='true'
              aria-controls='dropdown-menu'
              onClick={onRemoveSelectedSector}
              style={{ marginLeft: '15px' }}
            >
              <span>{selectedSector}</span>
              <span className='icon is-small'>
                <i className='fas fa-trash-alt' aria-hidden='true' />
              </span>
            </button>
          )
        }
      </div>
    </div>
  )
}
export default App;