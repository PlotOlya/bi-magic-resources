import React from "react";
import ReactECharts from 'echarts-for-react';
import { MyService } from "../services/Service";
import { UrlState } from "bi-internal/core"


export default class Graph extends React.Component<any> {

private _myService: MyService;
  private _urlService: UrlState;
  public _chart: any = null;
  public state: {
    data: any;
    option: any;
    filters:any
    table: boolean
  
  };

  public constructor(props) {
    super(props);
    this.state = {
      data: [],
      option: {},
      filters:[],
      table: false
    };
  }
  public componentDidMount(): void {

    const { cfg } = this.props;
    const koob = cfg.getRaw().dataSource?.koob;
    this._myService = MyService.createInstance(koob);
    this._myService.subscribeUpdatesAndNotify(this._onSvcUpdated);
    this._urlService = UrlState.getInstance()
    this._urlService.subscribeUpdatesAndNotify(this._onSrvcUpdated)
  }


  private _onSvcUpdated = (model) => {
    const {cfg} = this.props;
    const koob = cfg.getRaw().koob || "oracle.orders_full";
    const filters = cfg.getRaw().dataSource?.filters || {};


    if (model.loading || model.error) return;
    this._myService.getKoobDataByCfg({
      with: koob,
      columns: [
        'val_ru',
        'id_dt',
        'client'
      ],
      filters: {
        ...model.filters,
      },
      limit:10, 
    }).then(data => {
      this.setState({data: data})
  
    })}
    private _onSrvcUpdated = (model) => {
      if (model.loading || model.error) return;
      if (model.hasOwnProperty('table')) {
      }}
private handleChangeView () { 
  this._urlService.navigate({ table: String(!this.state.table) })
  this.setState({ table: !this.state.table })
}
public render() {
    const { data} = this.state;
  
    this.state.option=  {
      xAxis: {
        data: [...this.state.data.sort((a, b) => new Date(b.id_dt) - new Date(a.id_dt)).map((el) => el.id_dt)]
      },
      yAxis: {},
      series: [
        {
          data:[...this.state.data.map(el => el.val_ru)],
          type: 'line',
          smooth: true
        }
      ]
    };
    if (this.state.data.length === 0) return <div>Нет данных</div>
   
      return (
        <>

     {!this.state.table? 
     ( <div className="ComponentWrapper MyCustomComponent">
              <ReactECharts option={this.state.option} />
           </div>): 
           (   
            <table style={{ borderCollapse: 'collapse', width: '50%' }}>
            <thead>
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} style={{ border: '1px solid black', padding: '8px' }}>
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i} style={{ border: '1px solid black', padding: '8px' }}>
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
     
        <button type='button' onClick={() => this.handleChangeView()}>Показать другой вид</button>
        </>
        ); 
}}