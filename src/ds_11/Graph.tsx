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
    table: boolean;
    theme: any;
  };

  public constructor(props) {
    super(props);
    this.state = {
      data: [],
      theme: {},
      option: {},
      table: false
    };
  }
  public componentDidMount(): void {

    const { cfg } = this.props;
    const koob = cfg.getRaw().dataSource?.koob;
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
      limit:20, 
    }).then(data => {
     console.log('DATA__>', data);
      this.setState({data: data})

    })
    
}
public render() {
    const { data} = this.state;
    return (
      <div className="ComponentWrapper MyCustomComponent">
     
        {data.map(el =>
          <>
            <div>{el.val_ru}</div>
            <div>{el.id_dt}</div>
          </>
        )}
      </div>
    );
  }
}