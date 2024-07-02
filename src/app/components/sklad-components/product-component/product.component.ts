import { FlatTreeControl } from "@angular/cdk/tree";
import { Component, OnInit } from "@angular/core";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { TokenService } from "../../../services/token.service";
import { ProductService } from "../../../services/product.service";
import { SnackbarService } from "../../../services/snackbar.service";
import { TokenModel } from "../../../models/token";
import { ProductPropAnswModel } from "../../../models/product-models/product-prop-answ";
import { ProductQueryModel } from "../../../models/product-models/product-query";
import { ProductResponceModel } from "../../../models/product-models/product-responce";
import { ProductPropQuery } from "../../../models/product-models/product-prop-query";

interface PoductNode {
    id: string;
    name: string;
    children?: PoductNode[];
}
interface ExampleFlatNode {
    expandable: boolean;
    id: string;
    name: string;
    level: number;
}
@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {
    constructor(
        private tokenService: TokenService,
        private productService: ProductService,
        private snackBarService: SnackbarService
    ) { }

    productProp: ProductPropAnswModel = new ProductPropAnswModel('', '', '', '', '', '', [], []);
    selectedRowTree: string = ''
    group: string = '';
    scrollPosition = 8000;
    countListProducts: number = 0;
    searchValue: string = '';
    selectedSearchVar: string = 'article';
    productList: ProductResponceModel[] = []
    tableHead: string[] = ['Артикул', 'Наименование', 'Тип', 'Штрихкод', 'Остаток склад', 'Остаток брак', '']
    private _transformer = (node: PoductNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            id: node.id,
            name: node.name,
            level: level,
        };
    }
    treeFlattener = new MatTreeFlattener(
        this._transformer, node => node.level, node => node.expandable, node => node.children);
    treeControl = new FlatTreeControl<ExampleFlatNode>(
        node => node.level, node => node.expandable);
    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
    ngOnInit(): void {
        this.productService.GetTree().subscribe({
            next: result => {
                console.log(result);

                this.dataSource.data = result
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        });
    }

    onSelectNode(node: any) {
        this.clearProp();
        this.selectedRowTree = node.name;
        console.log(this.selectedRowTree);
        this.group = node.name.split(" ")[0];
        if (this.group) {
            this.productList = [];
            this.scrollPosition = 8000;
            this.productService.GetProduct(new ProductQueryModel(this.tokenService.getToken(), this.group, '', '', '', '', '', '')).subscribe({
                next: result => {
                    this.productList = result
                },
                error: error => {
                    console.log(error);
                    this.snackBarService.openRedSnackBar()
                }
            })
        }
    }
    clearProp() {
        this.productProp = new ProductPropAnswModel('', '', '', '', '', '', [], []);
    }
    onScroll(event: any) {
        if (event.target.scrollTop > this.scrollPosition) {
            this.scrollPosition += 8000;
            var pos = this.countListProducts + 200;
            if (pos % 200 == 0) {
                if (this.group) {
                    this.productService.GetProduct(new ProductQueryModel(this.tokenService.getToken(), this.group, '', '', '', '', '', String(pos))).subscribe({
                        next: response => {
                            this.productList = response
                        },
                        error: error => {
                            console.log(error);
                        }
                    });
                }
                let query;
                switch (this.selectedSearchVar) {
                    case 'article':
                        query = new ProductQueryModel(this.tokenService.getToken(), '', this.searchValue, '', '', '', '', String(pos))
                        break;
                    case 'name':
                        query = new ProductQueryModel(this.tokenService.getToken(), '', '', this.searchValue, '', '', '', String(pos))
                        break;
                    case 'barcode':
                        query = new ProductQueryModel(this.tokenService.getToken(), '', '', '', this.searchValue, '', '', String(pos))
                        break;
                    case 'storage':
                        query = new ProductQueryModel(this.tokenService.getToken(), '', '', '', '', this.searchValue, '', String(pos))
                        break;
                    case 'provider':
                        query = new ProductQueryModel(this.tokenService.getToken(), '', '', '', '', '', this.searchValue, String(pos))
                        break;
                    default:
                        query = new ProductQueryModel(this.tokenService.getToken(), '', this.searchValue, '', '', '', '', String(pos))
                        break;
                }
                this.productService.GetProduct(query).subscribe({
                    next: response => {
                        this.productList = response
                    },
                    error: error => {
                        console.log(error);
                    }
                });
            }
        }
    }

    isEmptySearchValue = false;
    onSearch() {
        this.clearProp();
        if (this.searchValue) {
            this.scrollPosition = 8000;
            this.group = '';
            this.productList = [];
            console.log(this.searchValue);
            this.isEmptySearchValue = false;
            let query;
            switch (this.selectedSearchVar) {
                case 'article':
                    query = new ProductQueryModel(this.tokenService.getToken(), '', this.searchValue, '', '', '', '', '')
                    break;
                case 'name':
                    query = new ProductQueryModel(this.tokenService.getToken(), '', '', this.searchValue, '', '', '', '')
                    break;
                case 'barcode':
                    query = new ProductQueryModel(this.tokenService.getToken(), '', '', '', this.searchValue, '', '', '')
                    break;
                case 'storage':
                    query = new ProductQueryModel(this.tokenService.getToken(), '', '', '', '', this.searchValue, '', '')
                    break;
                case 'provider':
                    query = new ProductQueryModel(this.tokenService.getToken(), '', '', '', '', '', this.searchValue, '')
                    break;
                default:
                    query = new ProductQueryModel(this.tokenService.getToken(), '', this.searchValue, '', '', '', '', '')
                    break;
            }
            this.productService.GetProduct(query).subscribe({
                next: response => {
                    this.productList = response
                },
                error: error => {
                    console.log(error);
                }
            });
        } else {
            this.isEmptySearchValue = true;
        }
    }
    selectedRow: string = ''
    onSelectRow(article: string) {
        this.selectedRow = article
        this.productService.GetProductProp(new ProductPropQuery(this.tokenService.getToken(), article)).subscribe({
            next: responce => {
                this.productProp = responce
            },
            error: error => {
                console.log(error);
                this.snackBarService.openRedSnackBar()
            }
        })
    }

}