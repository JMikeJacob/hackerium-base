import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component'
import { IndexComponent } from './index/index.component'
import { LoginComponent } from './login/login.component'
import { RegisterEmployerComponent } from './register-employer/register-employer.component'
import { SignupSplitComponent } from './signup-split/signup-split.component'
import { EmployerDashboardComponent } from './employer-dashboard/employer-dashboard.component'
import { JobBoardComponent } from './job-board/job-board.component'
import { JobPostComponent } from './job-post/job-post.component'
import { GeneralComponent } from './general/general.component'
import { CompanyProfileComponent } from './company-profile/company-profile.component' 

import { EmployerComponent } from './employer/employer.component'
import { EmployerJobBoardComponent } from './employer-job-board/employer-job-board.component'
import { EmployerJobPostComponent } from './employer-job-post/employer-job-post.component'
import { CreateJobPostComponent } from './create-job-post/create-job-post.component'
import { EditJobPostComponent } from './edit-job-post/edit-job-post.component' 
import { EmployerApplicationsComponent } from './employer-applications/employer-applications.component'
import { EditCompanyComponent } from './edit-company/edit-company.component'
import { EditEmployerComponent } from './edit-employer/edit-employer.component'
import { EmployerTestBoardComponent } from './employer-test-board/employer-test-board.component'
import { CreateTestComponent } from './create-test/create-test.component'

import { SeekerComponent } from './seeker/seeker.component'
import { SeekerJobBoardComponent } from './seeker-job-board/seeker-job-board.component'
import { SeekerJobPostComponent } from './seeker-job-post/seeker-job-post.component'
import { SeekerApplicationsComponent } from './seeker-applications/seeker-applications.component';
import { SeekerProfileComponent } from './seeker-profile/seeker-profile.component'
import { SeekerRecommendedComponent } from './seeker-recommended/seeker-recommended.component'
import { EditSeekerProfileComponent } from './edit-seeker-profile/edit-seeker-profile.component'
import { EditSeekerComponent } from './edit-seeker/edit-seeker.component'

import { CompanyComponent } from './company/company.component';
import { ProfileComponent } from './profile/profile.component'
import { EmployerTestComponent } from './employer-test/employer-test.component';
import { EditTestComponent } from './edit-test/edit-test.component';
import { SeekerTestComponent } from './seeker-test/seeker-test.component';
import { SubmitTestPageComponent } from './submit-test-page/submit-test-page.component';
import { EmployerViewResultsComponent } from './employer-view-results/employer-view-results.component';
import { TechnicalInterviewComponent } from './technical-interview/technical-interview.component';
import { NoNavbarComponent } from './no-navbar/no-navbar.component';

const routes: Routes = [
  { path: '', component: GeneralComponent, children: [
    { path: '', pathMatch: 'full', redirectTo: 'index' },
    { path: 'index', component: IndexComponent },
    { path: 'login', component: LoginComponent },
    // { path: 'signup', component: SignupSplitComponent },
    { path: 'register', children: [
      { path: '', redirectTo: 'seeker', pathMatch:'full' },
      { path: 'seeker', component: RegisterComponent },
      { path: 'employer', component: RegisterEmployerComponent },
      { path: '**', redirectTo: 'seeker'},
    ]},
  ]},
  { path: 'seeker', component: SeekerComponent, children: [
    { path: '', redirectTo: 'jobs', pathMatch: 'full' },
    { path: 'account', component: EditSeekerComponent},
    { path: 'profile', children: [
      { path: '', component: SeekerProfileComponent },
      { path: 'edit', component: EditSeekerProfileComponent }
    ] },
    { path: 'apps/:page', component: SeekerApplicationsComponent },
    { path: 'apps/test/answer', component: SeekerTestComponent },
    { path: 'apps/test/answer/submit', component: SubmitTestPageComponent },
    { path: 'jobs', children: [
      { path: '', redirectTo: '1', pathMatch:'full' },
      { path: ':page', component: JobBoardComponent },
      { path: 'recommended/:page', component:SeekerRecommendedComponent },
      { path: 'post/:id', component: SeekerJobPostComponent }
    ]},
    { path: 'company/:id', component: CompanyProfileComponent },
    { path: '**', redirectTo: 'jobs'}
    // { path: 'dashboard', component: EmployerDashboardComponent }
  ]},
  { path: 'employer', component: EmployerComponent, children: [
    { path: '', redirectTo: 'jobs', pathMatch: 'full'},
    // { path: 'dashboard', component: EmployerDashboardComponent },
    { path: 'account', component: EditEmployerComponent },
    { path: 'company', children: [
      { path: '', component: CompanyComponent },
      { path: 'edit', component: EditCompanyComponent },
      { path: '**', redirectTo: '' }
    ]},
    { path: 'jobs', children: [
      { path: '', redirectTo: '1', pathMatch: 'full' },
      { path: 'create', component: CreateJobPostComponent},
      { path: 'edit/:id', component: EditJobPostComponent },
      { path: ':page', component: EmployerJobBoardComponent },
      { path: 'post/:id', component: EmployerJobPostComponent }
    ] },
    { path: 'tests', children: [
      { path: '', redirectTo: '1', pathMatch: 'full' },
      { path: 'create', component: CreateTestComponent },
      { path: ':page', component: EmployerTestBoardComponent },
      { path: 'item/:id', component: EmployerTestComponent },
      { path: 'edit/:id', component: EditTestComponent}
    ] },
    { path: 'seekers/:id', component: ProfileComponent },
    { path: 'apps/:page', component: EmployerApplicationsComponent },
    { path: 'apps/test/results/:id', component: EmployerViewResultsComponent },
    { path: '**', redirectTo: 'dashboard' },
  ]},
  // { path: 'employer/dashboard', component: EmployerDashboardComponent },
  { path: 'jobs', component: GeneralComponent, children: [
      { path: '', redirectTo:'1', pathMatch: 'full'},
      { path: 'post/:id', component: JobPostComponent },
      { path: ':page', component: JobBoardComponent },
      { path: '**', redirectTo: '/1' }
  ] },
  { path: 'company', component: GeneralComponent, children: [
    { path: '', redirectTo:'1', pathMatch: 'full'},
    { path: ':id', component: CompanyProfileComponent },
    { path: '**', redirectTo: '/1' }
] },
  { path: 'interview', component: NoNavbarComponent, children: [
    { path: '', component: TechnicalInterviewComponent }
  ] }
  // { path: '**', redirectTo: 'index' }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
