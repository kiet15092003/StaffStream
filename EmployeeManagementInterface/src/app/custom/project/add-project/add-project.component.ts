import { ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { DomSanitizer } from '@angular/platform-browser';
import { AddNewProjectDTO } from '../../../shared/project/project.model';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { computed, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ProjectService } from '../../../shared/project/project.service';
import { MatStepperModule } from '@angular/material/stepper';

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatRadioModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    FormsModule,
    MatStepperModule
  ],
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css'],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProjectComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<AddProjectComponent>);
  projectInfo: FormGroup;
  newProject: AddNewProjectDTO = new AddNewProjectDTO();
  imageUrl: any = 'https://cdn.dribbble.com/users/3797032/screenshots/15941018/bizoo_-_business___corporate_psd_template.jpg';
  imageFile: File | null = null;
  @ViewChild('fileInput') fileInput!: ElementRef;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currenttechType = model('');
  readonly techTypes = signal(['Angular']);
  alltechTypes: string[] = []; 
  filteredtechTypes = computed(() => {
    const currenttechType = this.currenttechType().toLowerCase();
    return currenttechType
      ? this.alltechTypes.filter(techType => techType.toLowerCase().includes(currenttechType))
      : this.alltechTypes.slice();
  });
  readonly announcer = inject(LiveAnnouncer);

  constructor(
    private fb: FormBuilder, 
    private sanitizer: DomSanitizer, 
    private projectService: ProjectService) {

    this.projectInfo = this.fb.group({
      projectName: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z ]+$')])],
      description: ['', Validators.compose([Validators.required])],
      startDate: [new Date()],
      endDate: [new Date()]
    });
  }

  ngOnInit(): void {
    this.projectService.getProjectTechType().subscribe((techtypes) => {
      this.alltechTypes = techtypes;
    });
  }

  checkContainTechType(value: string){
    for (let index = 0; index < this.alltechTypes.length; index++) {
      const element = this.alltechTypes[index];
      if (element === value){
        return true;
      }
    }
    return false
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (!value) {
      return;
    }
    if (this.techTypes().includes(value)) {
      return;
    }
    if (this.checkContainTechType(value)) {
      this.techTypes.update(techTypes => [...techTypes, value]);
    }
    this.currenttechType.set('');
  }

  remove(techType: string): void {
    this.techTypes.update(techTypes => {
      const index = techTypes.indexOf(techType);
      if (index < 0) {
        return techTypes;
      }

      techTypes.splice(index, 1);
      this.announcer.announce(`Removed ${techType}`);
      return [...techTypes];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.techTypes().includes(event.option.viewValue)) {
      return;
    }
    this.techTypes.update(techTypes => [...techTypes, event.option.viewValue]);
    this.currenttechType.set('');
    event.option.deselect();
  }

  triggerFileUpload(): void {
    this.fileInput.nativeElement.click();
  }

  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      this.projectInfo.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = async () => {
        this.imageUrl = await this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onOkClick() {
    if (this.projectInfo.valid && this.techTypes().length!==0){
      const formData = this.projectInfo.value;
      this.newProject.image = this.imageFile;
      this.newProject.projectName = formData.projectName;
      this.newProject.description = formData.description;
      this.newProject.listTech = this.techTypes();
      this.newProject.startDate = formData.startDate.toISOString()
      this.newProject.endDate = formData.endDate.toISOString()
      this.dialogRef.close(this.newProject);
    }
  }
}