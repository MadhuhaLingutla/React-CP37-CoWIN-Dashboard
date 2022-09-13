// Write your code here

import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failed: 'FAILURE',
}
class CowinDashboard extends Component {
  state = {
    vaccinationData: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(apiUrl)

    if (response.ok === true) {
      const data = await response.json()
      const formatedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(each => ({
          vaccineDate: each.vaccine_date,
          dose1: each.dose_1,
          dose2: each.dose_2,
        })),
        vaccinationbyage: data.vaccination_by_age,
        vaccinationbygender: data.vaccination_by_gender,
      }
      console.log('Formated Data', formatedData)
      this.setState({
        vaccinationData: formatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failed})
    }
  }

  loaderView = () => (
    <div testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  displayCharts = () => {
    const {vaccinationData} = this.state
    const {
      last7DaysVaccination,
      vaccinationbyage,
      vaccinationbygender,
    } = vaccinationData
    return (
      <div className="charts-container">
        <VaccinationCoverage last7DaysVaccination={last7DaysVaccination} />
        <VaccinationByGender vaccinationbygender={vaccinationbygender} />
        <VaccinationByAge vaccinationbyage={vaccinationbyage} />
      </div>
    )
  }

  failedView = () => (
    <div className="failure-container">
      <img
        className="failure-view"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  decisionMaker = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      default:
        return null
      case apiStatusConstants.failed:
        return this.failedView()
      case apiStatusConstants.inProgress:
        return this.loaderView()
      case apiStatusConstants.success:
        return this.displayCharts()
    }
  }

  render() {
    return (
      <div className="cowin-container">
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            className="logo-image"
            alt="website logo"
          />
          <h1 className="header-title">Co-WIN</h1>
        </div>
        <h2 className="title">CoWIN Vaccination in India</h2>
        <div className="responsive-container">{this.decisionMaker()}</div>
      </div>
    )
  }
}

export default CowinDashboard
