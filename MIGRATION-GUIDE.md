# Migration Guide: Angular 15 → 19 + DevExtreme → Angular Material

This guide covers:
1. **Phase 1:** Upgrade Angular from 15 to 19 (in steps).
2. **Phase 2:** Add Angular Material and remove DevExtreme.

---

## Prerequisites

- **Backup** your project (e.g. commit to git or copy folder).
- Use **Node.js 18.19+ or 20.11+** (required for Angular 19).
- Ensure you have a **clean git status** so you can revert if needed.

---

## Phase 1: Migrate to Angular 19

Angular recommends upgrading **one major version at a time**. Do each step, fix any breaking changes, then run `ng build` and tests before the next step.

### Step 1.1 — Update to Angular 16

```bash
# Update Angular core, CLI, and related packages to 16.x
ng update @angular/core@16 @angular/cli@16 --force

# Update other Angular packages to match
ng update @angular/animations@16 @angular/common@16 @angular/compiler@16 @angular/forms@16 @angular/platform-browser@16 @angular/platform-browser-dynamic@16 @angular/router@16 --force

# Update dev packages
ng update @angular-devkit/build-angular@16 @angular/compiler-cli@16 @angular/localize@16 --force
```

**After Step 1.1:**

- Fix any deprecations or breaking changes (e.g. `RouterModule.forRoot` options, `providedIn` usage).
- Update **TypeScript** if `ng update` suggests it (Angular 16 typically uses TypeScript 4.9–5.0).
- Remove **tslint** if present; use **ESLint** instead (Angular 16+).
- Run: `npm install` then `ng build`.

---

### Step 1.2 — Update to Angular 17

```bash
ng update @angular/core@17 @angular/cli@17 --force
ng update @angular/animations@17 @angular/common@17 @angular/compiler@17 @angular/forms@17 @angular/platform-browser@17 @angular/platform-browser-dynamic@17 @angular/router@17 --force
ng update @angular-devkit/build-angular@17 @angular/compiler-cli@17 @angular/localize@17 --force
```

**After Step 1.2:**

- **Standalone components:** Optional; you can keep NgModules for now.
- **Control flow:** Optional migration from `*ngIf`/`*ngFor` to `@if`/`@for` (can do later).
- Run: `npm install` then `ng build`.

---

### Step 1.3 — Update to Angular 18

```bash
ng update @angular/core@18 @angular/cli@18 --force
ng update @angular/animations@18 @angular/common@18 @angular/compiler@18 @angular/forms@18 @angular/platform-browser@18 @angular/platform-browser-dynamic@18 @angular/router@18 --force
ng update @angular-devkit/build-angular@18 @angular/compiler-cli@18 @angular/localize@18 --force
```

**After Step 1.3:**

- Check `angular.json`: project might still be `browser` builder; **application** builder is the new default (you can switch in a later cleanup).
- Run: `npm install` then `ng build`.

---

### Step 1.4 — Update to Angular 19

```bash
ng update @angular/core@19 @angular/cli@19 --force
ng update @angular/animations@19 @angular/common@19 @angular/compiler@19 @angular/forms@19 @angular/platform-browser@19 @angular/platform-browser-dynamic@19 @angular/router@19 --force
ng update @angular-devkit/build-angular@19 @angular/compiler-cli@19 @angular/localize@19 --force
```

**After Step 1.4:**

- Align **TypeScript** to 5.4+ if required by Angular 19.
- Fix any new strict checks or API changes.
- Run: `npm install` then `ng build`.

---

### Step 1.5 — Align peer dependencies

After reaching Angular 19:

- Update **@angular/cdk** to `^19.x` (needed for Material).
- Update **ngx-bootstrap**, **ngx-toastr**, **ng2-charts** (and any other UI libs) to versions that support Angular 19 (check their npm or GitHub).
- Update **RxJS** to 7.x if not already: `npm install rxjs@7` (Angular 19 uses RxJS 7).
- Remove **rxjs-compat** if you no longer need it.

---

## Phase 2: Remove DevExtreme and Add Angular Material

Do this **after** the app builds and runs on Angular 19.

### Step 2.1 — Add Angular Material

```bash
ng add @angular/material
```

Choose a **prebuilt theme** (e.g. Indigo/Pink or your preference), **typography** Yes, **animations** Yes.

---

### Step 2.2 — Replace DevExtreme grids with Angular Material tables

**Where DevExtreme is used:**

| Location | Usage | Angular Material replacement |
|----------|--------|-------------------------------|
| `app.module.ts` | `DxDataGridModule`, `DxTemplateModule` | Remove; use `MatTableModule` only in feature modules that need it. |
| `fundtransfer.module.ts` | `DxDataGridModule`, `DxTemplateModule`, `DxTooltipModule` | `MatTableModule`, `MatPaginatorModule`, `MatSortModule`, `MatFormFieldModule` (for search), `MatTooltipModule`. |
| `billpayment.module.ts` | Same as above | Same. |
| `billpayment.component.html` | `<dx-data-grid>` with paging, search, custom cell templates | `<table mat-table>`, `<mat-paginator>`, filter with `MatFormField` + input. |
| `fundtransfer.component.html` | Two `<dx-data-grid>` (customer list + payment list in modal) | Two `<table mat-table>` (or one reusable table component) + `<mat-paginator>`. |
| `profile.component.html` | Class `dx-field` (styling only) | Replace with e.g. `row mb-3` or a Material form layout. |

**High-level replacement steps:**

1. **app.module.ts**  
   - Remove: `DxDataGridModule`, `DxTemplateModule`, and their imports.  
   - Do **not** add Material table here; add only in feature modules that need tables.

2. **fundtransfer.module.ts**  
   - Remove: `DxDataGridModule`, `DxTemplateModule`, `DxTooltipModule`.  
   - Add: `MatTableModule`, `MatPaginatorModule`, `MatSortModule`, `MatFormFieldModule`, `MatInputModule`, `MatTooltipModule`, `MatButtonModule`, `MatIconModule` (if you use icons).

3. **billpayment.module.ts**  
   - Same as fundtransfer: remove DevExtreme modules, add the same Material modules.

4. **billpayment.component.html**  
   - Replace `<dx-data-grid>` with:
     - A **data source** (e.g. `MatTableDataSource<YourRowType>`) in the component.
     - `<table mat-table [dataSource]="dataSource">` with `<ng-container matColumnDef="...">` for each column.
     - Custom cells (e.g. Payment Mode, Payable Amount, Action) using `matCellDef` and your existing logic.
     - `<mat-paginator>` for paging.
     - A search/filter `MatFormField` that updates `dataSource.filter` or rebuilds the data source.

5. **fundtransfer.component.html**  
   - Replace first grid (customer list) with a Material table (same pattern as above).
   - Replace second grid (Payment List in modal) with another Material table and its own data source / paginator if needed.

6. **profile.component.html**  
   - Find `class="dx-field row mb-3"` and change to e.g. `class="row mb-3"` (or use Material form field layout).

---

### Step 2.3 — Remove DevExtreme from project

1. **angular.json**  
   - In `projects.learnAngular.architect.build.options.styles`, **remove**:
     - `"node_modules/devextreme/dist/css/dx.common.css"`
     - `"node_modules/devextreme/dist/css/dx.light.css"`

2. **package.json**  
   - **Dependencies** — remove:
     - `"devextreme": "22.1.4"`
     - `"devextreme-angular": "22.1.4"`
     - `"devextreme-schematics": "^1.4.2"`
   - **devDependencies** — remove:
     - `"devextreme-cli": "latest"`
     - `"devextreme-themebuilder": "^22.1.3"`

3. **Install and verify**

   ```bash
   npm install
   ng build
   ```

4. **Search** the repo for any remaining `devextreme`, `dx-`, or `Dx` references and remove or replace them.

---

## Summary checklist

- [ ] Phase 1.1: Angular 16 + build passes  
- [ ] Phase 1.2: Angular 17 + build passes  
- [ ] Phase 1.3: Angular 18 + build passes  
- [ ] Phase 1.4: Angular 19 + build passes  
- [ ] Phase 1.5: Peer deps (CDK, RxJS, other libs) updated for Angular 19  
- [ ] Phase 2.1: Angular Material added  
- [ ] Phase 2.2: All `dx-data-grid` and DevExtreme usage replaced with Material (tables, tooltips, etc.)  
- [ ] Phase 2.3: DevExtreme removed from `angular.json` and `package.json`, no remaining references  
- [ ] Final: `ng build` and `ng serve` run without errors  

---

## Quick reference: Material table example

Minimal pattern for replacing one DevExtreme grid:

**Module:**

```ts
import { MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule } from '@angular/material';

@NgModule({
  imports: [
    // ...
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class YourModule {}
```

**Component (TS):**

```ts
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

dataSource = new MatTableDataSource<YourRowType>([]);
@ViewChild(MatPaginator) paginator: MatPaginator;

ngOnInit() {
  this.loadData(); // set this.dataSource.data = [...]
}
ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
}
```

**Template:**

```html
<mat-form-field>
  <input matInput (keyup)="applyFilter($event)" placeholder="Search">
</mat-form-field>
<table mat-table [dataSource]="dataSource">
  <ng-container matColumnDef="firstName">
    <th mat-header-cell *matHeaderCellDef>First Name</th>
    <td mat-cell *matCellDef="let row">{{ row.firstName }}</td>
  </ng-container>
  <!-- more columns; custom cells with *matCellDef -->
  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
<mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" pageSize="10"></mat-paginator>
```

Use this pattern in both **Fund Transfer** and **Bill Payment** screens, adapting columns and cell templates to match your current DevExtreme setup.
