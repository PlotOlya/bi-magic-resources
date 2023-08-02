import React from "react";
import cn from 'classnames';
import * as echarts from 'echarts';
import {MyService} from "../services/Service";
import {UrlState} from "bi-internal/core";

export default class Select extends React.Component<any> {
  private _myService: MyService;
  private _urlService: UrlState;
  public _chart: any = null;
  public state: {
    data: any;
    theme: any;
    filters: any;
  };

  public constructor(props) {
    super(props);
    this.state = {
      data: [],
      theme: {},
      filters: []
    };
  }

  public componentDidMount(): void {
 
    const {cfg} = this.props;
    const koob = cfg.getRaw().koob;
    this._myService = MyService.createInstance(koob);
    this._myService.subscribeUpdatesAndNotify(this._onSvcUpdated);
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
      limit:50,
    }).then(data => {
      this.setState({data: model.dictionaries});
      this.setState({ filters: [...this.state.filters,...model.dictionaries.client.values] })
    })
  }

  private handleSubmit() {
    this._myService.setFilters({ client: this.state.filters })
    // console.log('->>',this.state.filters);
    
  } 

  private handleChange(event) {
    const selectedValue = event.target.value;
      this.setState({ filters: [ selectedValue] })
    
  }

  public render() {
    const { data} = this.state;
    return (
      <div>
        <select onChange={(e) => this.handleChange(e)}>
      {data.client?.values.map(el =>
      <option value={el} >{el}</option>
      )}
      </select >
        <button type='button' onClick={() => this.handleSubmit()}>Выбрать</button>
    </div>
    );
  }
}