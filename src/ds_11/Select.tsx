import React from "react";
import './MyCustomComponent.scss';
import cn from 'classnames';
import * as echarts from 'echarts';
import {MyService} from "../services/Service";
import {ThemeVC} from "bi-internal/services";
import {UrlState} from "bi-internal/core";

export default class Select extends React.Component<any> {
  private _myService: MyService;
  private _urlService: UrlState;
  public _chart: any = null;
  public state: {
    data: any;
    theme: any;
  };

  public constructor(props) {
    super(props);
    this.state = {
      data: [],
      theme: {}
    };
  }

  public componentDidMount(): void {
    ThemeVC.getInstance().subscribeUpdatesAndNotify(this._onThemeVCUpdated);
    const {cfg} = this.props;
    const koob = cfg.getRaw().koob;
    this._myService = MyService.createInstance(koob);
    this._myService.subscribeUpdatesAndNotify(this._onSvcUpdated);
  }
  private _onThemeVCUpdated = (themeVM): void => {
    if (themeVM.error || themeVM.loading) return;
    this.setState({theme: themeVM.currentTheme});
  }
  private _onSvcUpdated = (model) => {
    const {cfg} = this.props;
    const koob = cfg.getRaw().koob || "oracle.orders_full";
    const filters = cfg.getRaw().dataSource?.filters || {};
    if (model.loading || model.error) return;
    this._myService.getKoobDataByCfg({
      with: koob,
      columns: [
        'id_dt', // столбцы из куба 
        'val_ru',
        'business_name',
        'client'
      ],
      filters: {
        ...model.filters,
      }
    }).then(data => {
      console.log(data);
      this.setState({data: data});
    })
  }
  public componentWillUnmount() {
    ThemeVC.getInstance().unsubscribe(this._onThemeVCUpdated);
  }
  public render() {
    const { data, theme} = this.state;
    return (
      <div>
        {data.map(el =>
          <>
          <input id={el} type='checkbox' />
            <label> {el}</label>
            {/* <div>{el.title}</div>
            <div>{el.value}</div> */}
          </>
        )}
      </div>
    );
  }
}