import React from "react";
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
    const koob = cfg.getRaw().dataSource?.koob;
    this._myService = MyService.createInstance(koob);
    this._myService.subscribeUpdatesAndNotify(this._onSvcUpdated);
  }

  private _onSvcUpdated = (model) => {
    const {cfg} = this.props;
    const koob = cfg.getRaw().dataSource?.koob || "oracle.orders_full";
    const filters = cfg.getRaw().dataSource?.filters || {};
    this.setState({data: model.dictionaries});
  }

  private handleChange(event) {
    const selectedValue = event.target.value;
      this.setState({ filters: [ selectedValue] })
  }

  private handleSubmit() {
    this._myService.setFilters({ client: ["=", ...this.state.filters] })
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